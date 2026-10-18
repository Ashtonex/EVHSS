from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Generic, Optional, TypeVar
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.domain.models import (
    Appointment,
    AuditEventLog,
    Client,
    GroomingRecord,
    InventoryItem,
    Invoice,
    MedicalRecord,
    Organization,
    POSTransaction,
    Pet,
    ReportingSnapshot,
    StaffProfile,
    StaffSchedule,
    User,
    Vaccination,
    WhatsAppNotificationLog,
)

ModelT = TypeVar("ModelT")


def _payload(values: Any, **extra: Any) -> dict[str, Any]:
    if values is None:
        data: dict[str, Any] = {}
    elif isinstance(values, dict):
        data = dict(values)
    elif hasattr(values, "model_dump"):
        data = values.model_dump(exclude_unset=True)
    elif hasattr(values, "dict"):
        data = values.dict(exclude_unset=True)
    else:
        raise TypeError(f"Unsupported repository payload: {type(values)!r}")
    data.update(extra)
    return data


class BaseRepository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, db: AsyncSession):
        self.db = db

    def _active_filters(self) -> list[Any]:
        if hasattr(self.model, "deleted_at"):
            return [self.model.deleted_at.is_(None)]
        return []

    def _organisation_filters(self, organisation_id: Optional[UUID]) -> list[Any]:
        if organisation_id is not None and hasattr(self.model, "organisation_id"):
            return [self.model.organisation_id == organisation_id]
        return []

    async def get(self, entity_id: UUID, *, organisation_id: Optional[UUID] = None) -> ModelT | None:
        stmt = select(self.model).where(
            self.model.id == entity_id,
            *self._active_filters(),
            *self._organisation_filters(organisation_id),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list(
        self,
        organisation_id: Optional[UUID] = None,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> Sequence[ModelT]:
        stmt = select(self.model).where(*self._active_filters(), *self._organisation_filters(organisation_id))
        if hasattr(self.model, "created_at"):
            stmt = stmt.order_by(self.model.created_at.desc())
        result = await self.db.execute(stmt.offset(offset).limit(limit))
        return result.scalars().all()

    async def count(self, organisation_id: Optional[UUID] = None) -> int:
        stmt = select(func.count(self.model.id)).where(*self._active_filters(), *self._organisation_filters(organisation_id))
        result = await self.db.execute(stmt)
        return int(result.scalar_one() or 0)

    async def create(self, values: Any = None, **extra: Any) -> ModelT:
        entity = self.model(**_payload(values, **extra))
        self.db.add(entity)
        await self.db.flush()
        return entity

    async def update(self, entity: ModelT, values: Any = None, **extra: Any) -> ModelT:
        for key, value in _payload(values, **extra).items():
            if hasattr(entity, key):
                setattr(entity, key, value)
        if hasattr(entity, "updated_at"):
            entity.updated_at = datetime.now(timezone.utc)
        self.db.add(entity)
        await self.db.flush()
        return entity

    async def delete(self, entity_id: UUID, *, organisation_id: Optional[UUID] = None, hard: bool = False) -> bool:
        entity = await self.get(entity_id, organisation_id=organisation_id)
        if entity is None:
            return False
        if hard or not hasattr(entity, "deleted_at"):
            await self.db.delete(entity)
        else:
            entity.deleted_at = datetime.now(timezone.utc)
            self.db.add(entity)
        await self.db.flush()
        return True


class UserRepository(BaseRepository[User]):
    model = User

    async def get_by_email(self, email: str, *, organisation_id: Optional[UUID] = None) -> User | None:
        result = await self.db.execute(
            select(User).where(
                User.email == email,
                *self._active_filters(),
                *self._organisation_filters(organisation_id),
            )
        )
        return result.scalar_one_or_none()


class OrganizationRepository(BaseRepository[Organization]):
    model = Organization

    async def get_default(self) -> Organization | None:
        result = await self.db.execute(select(Organization).order_by(Organization.created_at.asc()).limit(1))
        return result.scalar_one_or_none()


class ClientRepository(BaseRepository[Client]):
    model = Client

    async def get(self, entity_id: UUID, *, organisation_id: Optional[UUID] = None) -> Client | None:
        stmt = select(Client).options(selectinload(Client.user)).where(
            Client.id == entity_id,
            *self._active_filters(),
            *self._organisation_filters(organisation_id),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list(
        self,
        organisation_id: Optional[UUID] = None,
        *,
        limit: int = 100,
        offset: int = 0,
    ) -> Sequence[Client]:
        stmt = (
            select(Client)
            .options(selectinload(Client.user))
            .where(*self._active_filters(), *self._organisation_filters(organisation_id))
            .order_by(Client.created_at.desc())
        )
        result = await self.db.execute(stmt.offset(offset).limit(limit))
        return result.scalars().all()

    async def get_by_phone(self, *args: Any) -> Client | None:
        if len(args) != 2:
            raise TypeError("get_by_phone requires phone_number and organisation_id")
        first, second = args
        if isinstance(first, UUID):
            organisation_id, phone_number = first, second
        else:
            phone_number, organisation_id = first, second
        result = await self.db.execute(
            select(Client).where(
                Client.organisation_id == organisation_id,
                Client.phone_number == phone_number,
                Client.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()


class PetRepository(BaseRepository[Pet]):
    model = Pet

    async def get_by_client(self, client_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[Pet]:
        result = await self.db.execute(
            select(Pet)
            .where(Pet.client_id == client_id, Pet.deleted_at.is_(None), *self._organisation_filters(organisation_id))
            .order_by(Pet.name)
        )
        return result.scalars().all()

    async def get_by_client_and_name(self, *args: Any) -> Pet | None:
        if len(args) != 3:
            raise TypeError("get_by_client_and_name requires organisation_id, client_id, and name")
        first, second, third = args
        if isinstance(third, UUID):
            client_id, name, organisation_id = first, second, third
        else:
            organisation_id, client_id, name = first, second, third
        result = await self.db.execute(
            select(Pet).where(
                Pet.organisation_id == organisation_id,
                Pet.client_id == client_id,
                Pet.name == name,
                Pet.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()


class AppointmentRepository(BaseRepository[Appointment]):
    model = Appointment

    async def list_for_period(
        self,
        organisation_id: UUID,
        *,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        status: Optional[str] = None,
        client_id: Optional[UUID] = None,
        pet_id: Optional[UUID] = None,
        vet_id: Optional[UUID] = None,
    ) -> Sequence[Appointment]:
        filters = [Appointment.organisation_id == organisation_id, Appointment.deleted_at.is_(None)]
        if start is not None:
            filters.append(Appointment.appointment_date >= start)
        if end is not None:
            filters.append(Appointment.appointment_date < end)
        if status is not None:
            filters.append(Appointment.status == status)
        if client_id is not None:
            filters.append(Appointment.client_id == client_id)
        if pet_id is not None:
            filters.append(Appointment.pet_id == pet_id)
        if vet_id is not None:
            filters.append(Appointment.vet_id == vet_id)

        result = await self.db.execute(select(Appointment).where(*filters).order_by(Appointment.appointment_date))
        return result.scalars().all()

    async def get_by_client_id(self, client_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[Appointment]:
        if organisation_id is not None:
            return await self.list_for_period(organisation_id, client_id=client_id)
        result = await self.db.execute(
            select(Appointment)
            .where(Appointment.client_id == client_id, Appointment.deleted_at.is_(None))
            .order_by(Appointment.appointment_date)
        )
        return result.scalars().all()


class MedicalRecordRepository(BaseRepository[MedicalRecord]):
    model = MedicalRecord

    async def get_by_pet_id(self, pet_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[MedicalRecord]:
        result = await self.db.execute(
            select(MedicalRecord)
            .where(MedicalRecord.pet_id == pet_id, MedicalRecord.deleted_at.is_(None), *self._organisation_filters(organisation_id))
            .order_by(MedicalRecord.created_at.desc())
        )
        return result.scalars().all()


class VaccinationRepository(BaseRepository[Vaccination]):
    model = Vaccination

    async def get_by_pet_id(self, pet_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[Vaccination]:
        result = await self.db.execute(
            select(Vaccination)
            .where(Vaccination.pet_id == pet_id, Vaccination.deleted_at.is_(None), *self._organisation_filters(organisation_id))
            .order_by(Vaccination.date_administered.desc())
        )
        return result.scalars().all()


class GroomingRepository(BaseRepository[GroomingRecord]):
    model = GroomingRecord

    async def get_by_pet_id(self, pet_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[GroomingRecord]:
        result = await self.db.execute(
            select(GroomingRecord)
            .where(GroomingRecord.pet_id == pet_id, GroomingRecord.deleted_at.is_(None), *self._organisation_filters(organisation_id))
            .order_by(GroomingRecord.appointment_date.desc())
        )
        return result.scalars().all()


class InventoryRepository(BaseRepository[InventoryItem]):
    model = InventoryItem

    async def get_by_sku(self, sku: str, organisation_id: UUID) -> InventoryItem | None:
        result = await self.db.execute(
            select(InventoryItem).where(
                InventoryItem.organisation_id == organisation_id,
                InventoryItem.sku == sku,
                InventoryItem.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()

    async def list_low_stock(self, organisation_id: UUID, threshold: Decimal = Decimal("5")) -> Sequence[InventoryItem]:
        result = await self.db.execute(
            select(InventoryItem).where(
                InventoryItem.organisation_id == organisation_id,
                InventoryItem.deleted_at.is_(None),
                InventoryItem.stock_quantity <= threshold,
            )
        )
        return result.scalars().all()


class BillingRepository(BaseRepository[Invoice]):
    model = Invoice

    async def list_invoices(self, organisation_id: UUID, limit: int = 100) -> Sequence[Invoice]:
        return await self.list(organisation_id, limit=limit)

    async def get_by_client_id(self, client_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[Invoice]:
        result = await self.db.execute(
            select(Invoice)
            .where(Invoice.client_id == client_id, Invoice.deleted_at.is_(None), *self._organisation_filters(organisation_id))
            .order_by(Invoice.created_at.desc())
        )
        return result.scalars().all()

    async def create_invoice(self, **values: Any) -> Invoice:
        return await self.create(values)

    async def create_transaction(self, values: Any = None, **extra: Any) -> POSTransaction:
        transaction = POSTransaction(**_payload(values, **extra))
        self.db.add(transaction)
        await self.db.flush()
        return transaction

    async def list_transactions(self, organisation_id: UUID, limit: int = 100) -> Sequence[POSTransaction]:
        result = await self.db.execute(
            select(POSTransaction)
            .where(POSTransaction.organisation_id == organisation_id, POSTransaction.deleted_at.is_(None))
            .order_by(POSTransaction.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()


class StaffRepository(BaseRepository[StaffProfile]):
    model = StaffProfile

    async def list_profiles(self, organisation_id: UUID, limit: int = 100) -> Sequence[StaffProfile]:
        return await self.list(organisation_id, limit=limit)

    async def create_profile(self, **values: Any) -> StaffProfile:
        return await self.create(values)

    async def list_schedules(self, organisation_id: UUID, limit: int = 100) -> Sequence[StaffSchedule]:
        result = await self.db.execute(
            select(StaffSchedule)
            .where(StaffSchedule.organisation_id == organisation_id, StaffSchedule.deleted_at.is_(None))
            .order_by(StaffSchedule.shift_start)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_schedule(self, staff_id: UUID, *, organisation_id: Optional[UUID] = None) -> Sequence[StaffSchedule]:
        filters = [StaffSchedule.staff_id == staff_id, StaffSchedule.deleted_at.is_(None)]
        if organisation_id is not None:
            filters.append(StaffSchedule.organisation_id == organisation_id)
        result = await self.db.execute(select(StaffSchedule).where(*filters).order_by(StaffSchedule.shift_start))
        return result.scalars().all()

    async def create_schedule(self, **values: Any) -> StaffSchedule:
        schedule = StaffSchedule(**values)
        self.db.add(schedule)
        await self.db.flush()
        return schedule


class AuditRepository(BaseRepository[AuditEventLog]):
    model = AuditEventLog

    async def log_event(
        self,
        *,
        organisation_id: UUID,
        event_type: str,
        user_id: Optional[UUID] = None,
        entity_name: Optional[str] = None,
        entity_id: Optional[UUID] = None,
        details: Optional[str] = None,
    ) -> AuditEventLog:
        return await self.create(
            {
                "organisation_id": organisation_id,
                "event_type": event_type,
                "user_id": user_id,
                "entity_name": entity_name,
                "entity_id": entity_id,
                "details": details,
            }
        )

    async def recent(self, organisation_id: UUID, *, limit: int = 20) -> Sequence[AuditEventLog]:
        result = await self.db.execute(
            select(AuditEventLog)
            .where(AuditEventLog.organisation_id == organisation_id, AuditEventLog.deleted_at.is_(None))
            .order_by(AuditEventLog.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def list_audit_logs(self, organisation_id: UUID, limit: int = 100) -> Sequence[AuditEventLog]:
        return await self.list(organisation_id, limit=limit)

    async def create_audit_log(self, **values: Any) -> AuditEventLog:
        return await self.create(values)

    async def list_whatsapp_logs(self, organisation_id: UUID, limit: int = 100) -> Sequence[WhatsAppNotificationLog]:
        result = await self.db.execute(
            select(WhatsAppNotificationLog)
            .where(
                WhatsAppNotificationLog.organisation_id == organisation_id,
                WhatsAppNotificationLog.deleted_at.is_(None),
            )
            .order_by(WhatsAppNotificationLog.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def create_whatsapp_log(self, **values: Any) -> WhatsAppNotificationLog:
        log = WhatsAppNotificationLog(**values)
        self.db.add(log)
        await self.db.flush()
        return log

    async def list_reporting_snapshots(self, organisation_id: UUID, limit: int = 100) -> Sequence[ReportingSnapshot]:
        result = await self.db.execute(
            select(ReportingSnapshot)
            .where(ReportingSnapshot.organisation_id == organisation_id)
            .order_by(ReportingSnapshot.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()


class WhatsAppNotificationLogRepository(BaseRepository[WhatsAppNotificationLog]):
    model = WhatsAppNotificationLog


class ReportingSnapshotRepository(BaseRepository[ReportingSnapshot]):
    model = ReportingSnapshot
