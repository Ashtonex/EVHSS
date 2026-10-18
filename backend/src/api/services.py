from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api import schemas
from src.api.repositories import (
    AppointmentRepository,
    AuditRepository,
    ClientRepository,
    InventoryRepository,
    OrganizationRepository,
    PetRepository,
)
from src.domain.models import Appointment, Invoice, Pet, POSTransaction


class BookingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.organisations = OrganizationRepository(db)
        self.clients = ClientRepository(db)
        self.pets = PetRepository(db)
        self.appointments = AppointmentRepository(db)
        self.audit = AuditRepository(db)

    async def request_appointment(self, payload: schemas.PublicAppointmentRequest) -> Appointment:
        organisation = await self.organisations.get_default()
        if organisation is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Default organisation has not been seeded",
            )

        client = await self.clients.get_by_phone(organisation.id, payload.phone_number)
        if client is None:
            client = await self.clients.create(
                phone_number=payload.phone_number,
                address=payload.address,
                organisation_id=organisation.id,
            )

        pet = await self.pets.get_by_client_and_name(organisation.id, client.id, payload.pet_name)
        if pet is None:
            pet = await self.pets.create(
                client_id=client.id,
                name=payload.pet_name,
                species=payload.species,
                breed=payload.breed,
                organisation_id=organisation.id,
            )

        requested_at = payload.requested_datetime or datetime.now(timezone.utc) + timedelta(days=1)
        appointment = await self.appointments.create(
            client_id=client.id,
            pet_id=pet.id,
            vet_id=None,
            appointment_date=requested_at,
            status="scheduled",
            reason=f"{payload.type}: {payload.reason}",
            organisation_id=organisation.id,
        )

        await self.audit.create_whatsapp_log(
            recipient_phone=payload.phone_number,
            message_content=(
                f"Appointment request received for {payload.pet_name}. "
                f"EVHS will confirm the {payload.type} visit shortly."
            ),
            status="queued",
            appointment_id=appointment.id,
            organisation_id=organisation.id,
        )
        await self.audit.create_audit_log(
            event_type="public_appointment_requested",
            entity_name="appointments",
            entity_id=appointment.id,
            details=f"{payload.owner_name} requested {payload.type} appointment for {payload.pet_name}",
            organisation_id=organisation.id,
        )
        await self.db.commit()
        await self.db.refresh(appointment)
        return appointment


class POSService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.inventory = InventoryRepository(db)

    async def process_transaction(
        self,
        organisation_id: UUID,
        payload: schemas.POSCheckoutRequest,
    ) -> POSTransaction:
        total = Decimal("0.00")
        stock_updates = []

        for line in payload.items:
            item = await self.inventory.get(line.inventory_item_id)
            if item is None or item.organisation_id != organisation_id:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
            if item.unit_price is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{item.name} has no unit price")
            if item.stock_quantity < line.quantity:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient stock for {item.name}")
            total += item.unit_price * line.quantity
            stock_updates.append((item, line.quantity))

        invoice = Invoice(
            client_id=payload.client_id,
            total_amount=total,
            status="paid",
            organisation_id=organisation_id,
        )
        self.db.add(invoice)
        await self.db.flush()

        transaction = POSTransaction(
            invoice_id=invoice.id,
            amount_paid=total,
            payment_method=payload.payment_method,
            organisation_id=organisation_id,
        )
        self.db.add(transaction)

        for item, quantity in stock_updates:
            item.stock_quantity -= quantity

        await self.db.commit()
        await self.db.refresh(transaction)
        return transaction


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit = AuditRepository(db)

    async def get_stats(self, organisation_id: UUID) -> schemas.DashboardStats:
        today = date.today()
        today_start = datetime.combine(today, datetime.min.time(), tzinfo=timezone.utc)
        tomorrow_start = today_start + timedelta(days=1)

        appointments_today = await self._scalar_count(
            select(func.count(Appointment.id)).where(
                Appointment.organisation_id == organisation_id,
                Appointment.appointment_date >= today_start,
                Appointment.appointment_date < tomorrow_start,
            )
        )
        total_registered_pets = await self._scalar_count(
            select(func.count(Pet.id)).where(Pet.organisation_id == organisation_id)
        )
        pending_requests = await self._scalar_count(
            select(func.count(Appointment.id)).where(
                Appointment.organisation_id == organisation_id,
                Appointment.status.in_(["pending", "scheduled"]),
            )
        )
        revenue_total = await self.db.scalar(
            select(func.coalesce(func.sum(Invoice.total_amount), 0)).where(
                Invoice.organisation_id == organisation_id,
                Invoice.status == "paid",
            )
        )

        trend = []
        for days_ago in range(6, -1, -1):
            day = today - timedelta(days=days_ago)
            start = datetime.combine(day, datetime.min.time(), tzinfo=timezone.utc)
            end = start + timedelta(days=1)
            day_appointments = await self._scalar_count(
                select(func.count(Appointment.id)).where(
                    Appointment.organisation_id == organisation_id,
                    Appointment.appointment_date >= start,
                    Appointment.appointment_date < end,
                )
            )
            day_revenue = await self.db.scalar(
                select(func.coalesce(func.sum(Invoice.total_amount), 0)).where(
                    Invoice.organisation_id == organisation_id,
                    Invoice.status == "paid",
                    Invoice.created_at >= start,
                    Invoice.created_at < end,
                )
            )
            trend.append(
                schemas.DashboardTrendPoint(
                    date=day,
                    appointments=day_appointments,
                    revenue=Decimal(day_revenue or 0),
                )
            )

        recent_activity = await self.audit.list_audit_logs(organisation_id, limit=5)
        return schemas.DashboardStats(
            appointments_today=appointments_today,
            total_registered_pets=total_registered_pets,
            revenue_total=Decimal(revenue_total or 0),
            pending_requests=pending_requests,
            seven_day_trend=trend,
            recent_activity=list(recent_activity),
        )

    async def _scalar_count(self, stmt) -> int:
        value = await self.db.scalar(stmt)
        return int(value or 0)
