from datetime import date, datetime
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# --- SHARED BASE MIXINS (to mirror SQLAlchemy mixins) ---

class TimestampSchema(BaseModel):
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None


class AuditSchema(BaseModel):
    created_by: Optional[UUID] = None
    updated_by: Optional[UUID] = None


class OrganizationSchema(BaseModel):
    organisation_id: UUID


# --- JWT AUTHENTICATION SCHEMAS ---

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=1)


# --- 1. ORGANIZATION SCHEMAS ---

class OrganizationBase(BaseModel):
    name: str = Field(..., max_length=255)


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)


class OrganizationInDB(OrganizationBase, TimestampSchema):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)


# --- 2. USER SCHEMAS ---

class UserBase(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    is_active: Optional[bool] = True
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)


class UserCreate(UserBase):
    password: str
    organisation_id: UUID


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, max_length=255)
    password: Optional[str] = None
    is_active: Optional[bool] = None
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)


class UserInDB(UserBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- 3. ROLE SCHEMAS ---

class RoleBase(BaseModel):
    name: str = Field(..., max_length=100)


class RoleCreate(RoleBase):
    organisation_id: UUID


class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)


class RoleInDB(RoleBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- 4. USER ROLE SCHEMAS ---

class UserRoleBase(BaseModel):
    user_id: UUID
    role_id: UUID


class UserRoleCreate(UserRoleBase):
    organisation_id: UUID


class UserRoleUpdate(BaseModel):
    user_id: Optional[UUID] = None
    role_id: Optional[UUID] = None


class UserRoleInDB(UserRoleBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- 5. CLIENT SCHEMAS ---

class ClientBase(BaseModel):
    user_id: Optional[UUID] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None


class ClientCreate(ClientBase):
    organisation_id: Optional[UUID] = None


class ClientUpdate(BaseModel):
    user_id: Optional[UUID] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None


class ClientInDB(ClientBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class ClientUserSummary(BaseModel):
    id: UUID
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ClientResponse(ClientInDB):
    users: Optional[ClientUserSummary] = Field(None, validation_alias="user")


# --- 6. PET SCHEMAS ---

class PetBase(BaseModel):
    client_id: UUID
    name: str = Field(..., max_length=100)
    species: Optional[str] = Field(None, max_length=50)
    breed: Optional[str] = Field(None, max_length=100)
    date_of_birth: Optional[date] = None
    weight: Optional[Decimal] = Field(None)


class PetCreate(PetBase):
    organisation_id: Optional[UUID] = None


class PetUpdate(BaseModel):
    client_id: Optional[UUID] = None
    name: Optional[str] = Field(None, max_length=100)
    species: Optional[str] = Field(None, max_length=50)
    breed: Optional[str] = Field(None, max_length=100)
    date_of_birth: Optional[date] = None
    weight: Optional[Decimal] = Field(None)


class PetInDB(PetBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class PetResponse(PetInDB):
    pass


# --- 7. CLIENT PORTAL SESSION SCHEMAS ---

class ClientPortalSessionBase(BaseModel):
    client_id: UUID
    session_token: str = Field(..., max_length=255)
    expires_at: datetime


class ClientPortalSessionCreate(ClientPortalSessionBase):
    organisation_id: UUID


class ClientPortalSessionUpdate(BaseModel):
    client_id: Optional[UUID] = None
    session_token: Optional[str] = Field(None, max_length=255)
    expires_at: Optional[datetime] = None


class ClientPortalSessionInDB(ClientPortalSessionBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# --- 8. APPOINTMENT SCHEMAS ---

class AppointmentBase(BaseModel):
    client_id: UUID
    pet_id: UUID
    vet_id: Optional[UUID] = None
    appointment_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)
    reason: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    organisation_id: Optional[UUID] = None


class PublicAppointmentRequest(BaseModel):
    type: str = Field(..., max_length=20)
    owner_name: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=1, max_length=20)
    pet_name: str = Field(..., min_length=1, max_length=100)
    species: Optional[str] = Field(None, max_length=50)
    breed: Optional[str] = Field(None, max_length=100)
    reason: str = Field(..., min_length=1)
    requested_datetime: Optional[datetime] = None
    address: Optional[str] = None


class AppointmentUpdate(BaseModel):
    client_id: Optional[UUID] = None
    pet_id: Optional[UUID] = None
    vet_id: Optional[UUID] = None
    appointment_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)
    reason: Optional[str] = None


class AppointmentInDB(AppointmentBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class AppointmentResponse(AppointmentInDB):
    pass


# --- 9. MEDICAL RECORD SCHEMAS ---

class MedicalRecordBase(BaseModel):
    pet_id: UUID
    vet_id: UUID
    appointment_id: Optional[UUID] = None
    notes: Optional[str] = None


class MedicalRecordCreate(MedicalRecordBase):
    organisation_id: Optional[UUID] = None


class MedicalRecordUpdate(BaseModel):
    pet_id: Optional[UUID] = None
    vet_id: Optional[UUID] = None
    appointment_id: Optional[UUID] = None
    notes: Optional[str] = None


class MedicalRecordInDB(MedicalRecordBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class MedicalRecordResponse(MedicalRecordInDB):
    pass


# --- 10. VACCINATION SCHEMAS ---

class VaccinationBase(BaseModel):
    pet_id: UUID
    vaccine_name: str = Field(..., max_length=255)
    date_administered: date
    next_due_date: Optional[date] = None


class VaccinationCreate(VaccinationBase):
    organisation_id: Optional[UUID] = None


class VaccinationUpdate(BaseModel):
    pet_id: Optional[UUID] = None
    vaccine_name: Optional[str] = Field(None, max_length=255)
    date_administered: Optional[date] = None
    next_due_date: Optional[date] = None


class VaccinationInDB(VaccinationBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class VaccinationResponse(VaccinationInDB):
    pass


# --- 11. GROOMING RECORD SCHEMAS ---

class GroomingRecordBase(BaseModel):
    pet_id: UUID
    groomer_id: UUID
    appointment_date: Optional[datetime] = None
    services_provided: Optional[str] = None
    groomer_notes: Optional[str] = None


class GroomingRecordCreate(GroomingRecordBase):
    organisation_id: Optional[UUID] = None


class GroomingRecordUpdate(BaseModel):
    pet_id: Optional[UUID] = None
    groomer_id: Optional[UUID] = None
    appointment_date: Optional[datetime] = None
    services_provided: Optional[str] = None
    groomer_notes: Optional[str] = None


class GroomingRecordInDB(GroomingRecordBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class GroomingRecordResponse(GroomingRecordInDB):
    pass


# --- 12. INVENTORY ITEM SCHEMAS ---

class InventoryItemBase(BaseModel):
    name: str = Field(..., max_length=255)
    sku: Optional[str] = Field(None, max_length=100)
    stock_quantity: Decimal = Field(default=Decimal("0.0"))
    unit_price: Optional[Decimal] = Field(None)


class InventoryItemCreate(InventoryItemBase):
    organisation_id: Optional[UUID] = None


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    sku: Optional[str] = Field(None, max_length=100)
    stock_quantity: Optional[Decimal] = Field(None)
    unit_price: Optional[Decimal] = Field(None)


class InventoryItemInDB(InventoryItemBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class InventoryItemResponse(InventoryItemInDB):
    pass


# --- 13. INVOICE SCHEMAS ---

class InvoiceBase(BaseModel):
    client_id: UUID
    total_amount: Decimal = Field(...)
    status: Optional[str] = Field(None, max_length=50)


class InvoiceCreate(InvoiceBase):
    organisation_id: Optional[UUID] = None


class InvoiceUpdate(BaseModel):
    client_id: Optional[UUID] = None
    total_amount: Optional[Decimal] = Field(None)
    status: Optional[str] = Field(None, max_length=50)


class InvoiceInDB(InvoiceBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class InvoiceResponse(InvoiceInDB):
    pass


# --- 14. POS TRANSACTION SCHEMAS ---

class POSTransactionBase(BaseModel):
    invoice_id: Optional[UUID] = None
    amount_paid: Decimal = Field(...)
    payment_method: Optional[str] = Field(None, max_length=50)


class POSTransactionCreate(POSTransactionBase):
    organisation_id: UUID


class POSTransactionLineItem(BaseModel):
    inventory_item_id: UUID
    quantity: Decimal = Field(..., gt=0)


class POSCheckoutRequest(BaseModel):
    client_id: UUID
    payment_method: str = Field(..., max_length=50)
    items: List[POSTransactionLineItem] = Field(..., min_length=1)


class POSTransactionUpdate(BaseModel):
    invoice_id: Optional[UUID] = None
    amount_paid: Optional[Decimal] = Field(None)
    payment_method: Optional[str] = Field(None, max_length=50)


class POSTransactionInDB(POSTransactionBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class POSTransactionResponse(POSTransactionInDB):
    pass


# --- 15. STAFF PROFILE SCHEMAS ---

class StaffProfileBase(BaseModel):
    user_id: UUID
    job_title: Optional[str] = Field(None, max_length=100)
    hire_date: Optional[date] = None


class StaffProfileCreate(StaffProfileBase):
    organisation_id: Optional[UUID] = None


class StaffProfileUpdate(BaseModel):
    user_id: Optional[UUID] = None
    job_title: Optional[str] = Field(None, max_length=100)
    hire_date: Optional[date] = None


class StaffProfileInDB(StaffProfileBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class StaffProfileResponse(StaffProfileInDB):
    pass


# --- 16. STAFF SCHEDULE SCHEMAS ---

class StaffScheduleBase(BaseModel):
    staff_id: UUID
    shift_start: datetime
    shift_end: datetime


class StaffScheduleCreate(StaffScheduleBase):
    organisation_id: Optional[UUID] = None


class StaffScheduleUpdate(BaseModel):
    staff_id: Optional[UUID] = None
    shift_start: Optional[datetime] = None
    shift_end: Optional[datetime] = None


class StaffScheduleInDB(StaffScheduleBase, TimestampSchema, AuditSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class StaffScheduleResponse(StaffScheduleInDB):
    pass


# --- 17. WHATSAPP NOTIFICATION LOG SCHEMAS ---

class WhatsAppNotificationLogBase(BaseModel):
    recipient_phone: str = Field(..., max_length=20)
    message_content: str
    status: Optional[str] = Field(None, max_length=50)
    appointment_id: Optional[UUID] = None


class WhatsAppNotificationLogCreate(WhatsAppNotificationLogBase):
    organisation_id: UUID


class WhatsAppNotificationLogUpdate(BaseModel):
    recipient_phone: Optional[str] = Field(None, max_length=20)
    message_content: Optional[str] = None
    status: Optional[str] = Field(None, max_length=50)
    appointment_id: Optional[UUID] = None


class WhatsAppNotificationLogInDB(WhatsAppNotificationLogBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class WhatsAppLogResponse(WhatsAppNotificationLogInDB):
    pass


# --- 18. AUDIT EVENT LOG SCHEMAS ---

class AuditEventLogBase(BaseModel):
    user_id: Optional[UUID] = None
    event_type: str = Field(..., max_length=100)
    entity_name: Optional[str] = Field(None, max_length=100)
    entity_id: Optional[UUID] = None
    details: Optional[str] = None


class AuditEventLogCreate(AuditEventLogBase):
    organisation_id: UUID


class AuditEventLogUpdate(BaseModel):
    user_id: Optional[UUID] = None
    event_type: Optional[str] = Field(None, max_length=100)
    entity_name: Optional[str] = Field(None, max_length=100)
    entity_id: Optional[UUID] = None
    details: Optional[str] = None


class AuditEventLogInDB(AuditEventLogBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class AuditEventResponse(AuditEventLogInDB):
    pass


# --- 19. REPORTING SNAPSHOT SCHEMAS ---

class ReportingSnapshotBase(BaseModel):
    report_type: str = Field(..., max_length=100)
    snapshot_data: Optional[str] = None
    generated_at: Optional[datetime] = None


class ReportingSnapshotCreate(ReportingSnapshotBase):
    organisation_id: UUID


class ReportingSnapshotUpdate(BaseModel):
    report_type: Optional[str] = Field(None, max_length=100)
    snapshot_data: Optional[str] = None
    generated_at: Optional[datetime] = None


class ReportingSnapshotInDB(ReportingSnapshotBase, TimestampSchema, OrganizationSchema):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class DashboardTrendPoint(BaseModel):
    date: date
    appointments: int = 0
    revenue: Decimal = Field(default=Decimal("0.00"))


class DashboardStats(BaseModel):
    appointments_today: int = 0
    total_registered_pets: int = 0
    revenue_total: Decimal = Field(default=Decimal("0.00"))
    pending_requests: int = 0
    seven_day_trend: List[DashboardTrendPoint] = Field(default_factory=list)
    recent_activity: List[AuditEventResponse] = Field(default_factory=list)
