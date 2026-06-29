from sqlalchemy import Column, String, Boolean, ForeignKey, Text, Date, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database import Base
from src.domain.base_model import TimestampMixin, AuditMixin, OrganizationMixin, generate_uuid

class Organization(Base, TimestampMixin):
    __tablename__ = "organisations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    # ...

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

class Client(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "clients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    phone_number = Column(String(20))
    address = Column(Text)

class Pet(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "pets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    name = Column(String(100), nullable=False)
    species = Column(String(50))
    breed = Column(String(100))
    date_of_birth = Column(Date)
    weight = Column(Numeric(5, 2))

class Appointment(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "appointments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    vet_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    appointment_date = Column(DateTime(timezone=True))
    status = Column(String(50)) # e.g. scheduled, completed, cancelled
    reason = Column(Text)

class MedicalRecord(Base, TimestampMixin, AuditMixin, OrganizationMixin):
    __tablename__ = "medical_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"))
    vet_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    notes = Column(Text)

# Added enough to verify schema creation. More tables will be added via migrations.
