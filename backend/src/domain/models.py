from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, ForeignKey, Text, Date, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database import Base
from src.domain.base_model import TimestampMixin, AuditMixin, OrganizationMixin, generate_uuid

# Identity & Access
class Organization(Base, TimestampMixin):
    __tablename__ = "organisations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)

class User(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    first_name = Column(String(255))
    last_name = Column(String(255))

class Role(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "roles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)

class UserRole(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "user_roles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"))

# CRM & Client Management
class Client(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "clients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    phone_number = Column(String(20))
    address = Column(Text)
    user = relationship("User")

class Pet(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "pets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    name = Column(String(100), nullable=False)
    species = Column(String(50))
    breed = Column(String(100))
    date_of_birth = Column(Date)
    weight = Column(Numeric(5, 2))

class ClientPortalSession(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "client_portal_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    session_token = Column(String(255), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)

# Clinic Management
class Appointment(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "appointments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    vet_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    appointment_date = Column(DateTime(timezone=True))
    status = Column(String(50)) # scheduled, completed, cancelled
    reason = Column(Text)

class MedicalRecord(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "medical_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    vet_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    notes = Column(Text)

class Vaccination(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "vaccinations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    vaccine_name = Column(String(255), nullable=False)
    date_administered = Column(Date, nullable=False)
    next_due_date = Column(Date, nullable=True)

# Grooming Management
class GroomingRecord(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "grooming_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    groomer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    appointment_date = Column(DateTime(timezone=True))
    services_provided = Column(Text)
    groomer_notes = Column(Text)

# Retail, Inventory & Billing
class InventoryItem(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "inventory"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True)
    stock_quantity = Column(Numeric(10, 2), default=0)
    unit_price = Column(Numeric(10, 2))

class Invoice(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "invoices"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50)) # unpaid, paid, void

class POSTransaction(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "pos_transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=True)
    amount_paid = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(50))

# Staff Management
class StaffProfile(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "staff_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    job_title = Column(String(100))
    hire_date = Column(Date)

class StaffSchedule(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "staff_scheduling"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id"))
    shift_start = Column(DateTime(timezone=True), nullable=False)
    shift_end = Column(DateTime(timezone=True), nullable=False)

# System & Audit
class WhatsAppNotificationLog(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "whatsapp_notification_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    recipient_phone = Column(String(20), nullable=False)
    message_content = Column(Text, nullable=False)
    status = Column(String(50)) # sent, failed, delivered
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)

class AuditEventLog(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "audit_event_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    event_type = Column(String(100), nullable=False)
    entity_name = Column(String(100))
    entity_id = Column(UUID(as_uuid=True))
    details = Column(Text)

class ReportingSnapshot(Base, TimestampMixin, OrganizationMixin):
    __tablename__ = "reporting_snapshots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    report_type = Column(String(100), nullable=False)
    snapshot_data = Column(Text) # JSON string representing the snapshot
    generated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
