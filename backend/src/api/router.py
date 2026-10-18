from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.api import schemas
from src.api.dependencies import get_current_active_user
from src.api.repositories import (
    AppointmentRepository,
    AuditRepository,
    BillingRepository,
    ClientRepository,
    GroomingRepository,
    InventoryRepository,
    MedicalRecordRepository,
    PetRepository,
    StaffRepository,
    UserRepository,
    VaccinationRepository,
)
from src.api.services import BookingService, DashboardService, POSService
from src.core.security import create_access_token, verify_password
from src.domain.models import User
from src.infrastructure.database import get_db

api_router = APIRouter()

CurrentUser = Annotated[User, Depends(get_current_active_user)]
DbSession = Annotated[AsyncSession, Depends(get_db)]

auth_router = APIRouter(tags=["Authentication"])
clinic_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["Clinic (Vet)"])
grooming_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["Grooming (Shampooch)"])
crm_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["CRM & Client Management"])
inventory_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["Inventory & Retail"])
billing_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["Billing & POS"])
hr_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["HR & Staff"])
system_router = APIRouter(dependencies=[Depends(get_current_active_user)], tags=["System, Audits & Analytics"])
public_router = APIRouter(tags=["Public API"])


@public_router.post("/appointments/request", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def request_appointment(payload: schemas.PublicAppointmentRequest, db: DbSession):
    return await BookingService(db).request_appointment(payload)


@auth_router.post("/login", response_model=schemas.Token)
async def login(payload: schemas.LoginRequest, db: DbSession):
    user = await UserRepository(db).get_by_email(payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return schemas.Token(access_token=create_access_token(user.id))


@auth_router.get("/me", response_model=schemas.UserResponse)
async def get_me(current_user: CurrentUser):
    return current_user


@clinic_router.get("/appointments", response_model=list[schemas.AppointmentResponse])
async def get_appointments(db: DbSession, current_user: CurrentUser):
    return await AppointmentRepository(db).list(current_user.organisation_id)


@clinic_router.post("/appointments", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: schemas.AppointmentCreate, db: DbSession, current_user: CurrentUser):
    appointment = await AppointmentRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return appointment


@clinic_router.patch("/appointments/{appointment_id}", response_model=schemas.AppointmentResponse)
async def update_appointment(
    appointment_id: UUID,
    payload: schemas.AppointmentUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    repo = AppointmentRepository(db)
    appointment = await _tenant_entity(repo, appointment_id, current_user)
    appointment = await repo.update(
        appointment,
        **payload.model_dump(exclude_unset=True),
        updated_by=current_user.id,
    )
    await db.commit()
    return appointment


@clinic_router.get("/medical-records", response_model=list[schemas.MedicalRecordResponse])
async def get_medical_records(db: DbSession, current_user: CurrentUser):
    return await MedicalRecordRepository(db).list(current_user.organisation_id)


@clinic_router.post("/medical-records", response_model=schemas.MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_medical_record(payload: schemas.MedicalRecordCreate, db: DbSession, current_user: CurrentUser):
    record = await MedicalRecordRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return record


@clinic_router.get("/vaccinations", response_model=list[schemas.VaccinationResponse])
async def get_vaccinations(db: DbSession, current_user: CurrentUser):
    return await VaccinationRepository(db).list(current_user.organisation_id)


@clinic_router.post("/vaccinations", response_model=schemas.VaccinationResponse, status_code=status.HTTP_201_CREATED)
async def create_vaccination(payload: schemas.VaccinationCreate, db: DbSession, current_user: CurrentUser):
    vaccination = await VaccinationRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return vaccination


@grooming_router.get("/records", response_model=list[schemas.GroomingRecordResponse])
async def get_grooming_records(db: DbSession, current_user: CurrentUser):
    return await GroomingRepository(db).list(current_user.organisation_id)


@grooming_router.post("/records", response_model=schemas.GroomingRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_grooming_record(payload: schemas.GroomingRecordCreate, db: DbSession, current_user: CurrentUser):
    record = await GroomingRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return record


@crm_router.get("/clients", response_model=list[schemas.ClientResponse])
async def get_clients(db: DbSession, current_user: CurrentUser):
    return await ClientRepository(db).list(current_user.organisation_id)


@crm_router.post("/clients", response_model=schemas.ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(payload: schemas.ClientCreate, db: DbSession, current_user: CurrentUser):
    client = await ClientRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return client


@crm_router.get("/pets", response_model=list[schemas.PetResponse])
async def get_pets(db: DbSession, current_user: CurrentUser):
    return await PetRepository(db).list(current_user.organisation_id)


@crm_router.post("/pets", response_model=schemas.PetResponse, status_code=status.HTTP_201_CREATED)
async def create_pet(payload: schemas.PetCreate, db: DbSession, current_user: CurrentUser):
    pet = await PetRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return pet


@inventory_router.get("/items", response_model=list[schemas.InventoryItemResponse])
async def get_inventory_items(db: DbSession, current_user: CurrentUser):
    return await InventoryRepository(db).list(current_user.organisation_id)


@inventory_router.post("/items", response_model=schemas.InventoryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_inventory_item(payload: schemas.InventoryItemCreate, db: DbSession, current_user: CurrentUser):
    item = await InventoryRepository(db).create(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return item


@inventory_router.patch("/items/{item_id}", response_model=schemas.InventoryItemResponse)
async def update_inventory_item(item_id: UUID, payload: schemas.InventoryItemUpdate, db: DbSession, current_user: CurrentUser):
    repo = InventoryRepository(db)
    item = await _tenant_entity(repo, item_id, current_user)
    item = await repo.update(item, **payload.model_dump(exclude_unset=True), updated_by=current_user.id)
    await db.commit()
    return item


@billing_router.get("/invoices", response_model=list[schemas.InvoiceResponse])
async def get_invoices(db: DbSession, current_user: CurrentUser):
    return await BillingRepository(db).list_invoices(current_user.organisation_id)


@billing_router.post("/invoices", response_model=schemas.InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(payload: schemas.InvoiceCreate, db: DbSession, current_user: CurrentUser):
    invoice = await BillingRepository(db).create_invoice(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return invoice


@billing_router.post("/pos/transaction", response_model=schemas.POSTransactionResponse, status_code=status.HTTP_201_CREATED)
async def process_pos_transaction(payload: schemas.POSCheckoutRequest, db: DbSession, current_user: CurrentUser):
    return await POSService(db).process_transaction(current_user.organisation_id, payload)


@hr_router.get("/staff-profiles", response_model=list[schemas.StaffProfileResponse])
async def get_staff_profiles(db: DbSession, current_user: CurrentUser):
    return await StaffRepository(db).list_profiles(current_user.organisation_id)


@hr_router.post("/staff-profiles", response_model=schemas.StaffProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_staff_profile(payload: schemas.StaffProfileCreate, db: DbSession, current_user: CurrentUser):
    profile = await StaffRepository(db).create_profile(
        **_tenant_payload(payload, current_user),
        created_by=current_user.id,
    )
    await db.commit()
    return profile


@hr_router.get("/schedules", response_model=list[schemas.StaffScheduleResponse])
async def get_staff_schedules(db: DbSession, current_user: CurrentUser):
    return await StaffRepository(db).list_schedules(current_user.organisation_id)


@hr_router.post("/schedules", response_model=schemas.StaffScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_staff_schedule(payload: schemas.StaffScheduleCreate, db: DbSession, current_user: CurrentUser):
    schedule = await StaffRepository(db).create_schedule(**_tenant_payload(payload, current_user))
    await db.commit()
    return schedule


@system_router.get("/dashboard-stats", response_model=schemas.DashboardStats)
async def get_dashboard_stats(db: DbSession, current_user: CurrentUser):
    return await DashboardService(db).get_stats(current_user.organisation_id)


@system_router.get("/audit-logs", response_model=list[schemas.AuditEventResponse])
async def get_audit_logs(db: DbSession, current_user: CurrentUser):
    return await AuditRepository(db).list_audit_logs(current_user.organisation_id)


@system_router.get("/whatsapp-logs", response_model=list[schemas.WhatsAppLogResponse])
async def get_whatsapp_logs(db: DbSession, current_user: CurrentUser):
    return await AuditRepository(db).list_whatsapp_logs(current_user.organisation_id)


def _tenant_payload(payload, current_user: User) -> dict:
    values = payload.model_dump(exclude_unset=True)
    values["organisation_id"] = current_user.organisation_id
    return values


async def _tenant_entity(repo, entity_id: UUID, current_user: User):
    entity = await repo.get(entity_id)
    if entity is None or entity.organisation_id != current_user.organisation_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return entity


api_router.include_router(public_router, prefix="/public")
api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(clinic_router, prefix="/clinic")
api_router.include_router(grooming_router, prefix="/grooming")
api_router.include_router(crm_router, prefix="/crm")
api_router.include_router(inventory_router, prefix="/inventory")
api_router.include_router(billing_router, prefix="/billing")
api_router.include_router(hr_router, prefix="/hr")
api_router.include_router(system_router, prefix="/system")
