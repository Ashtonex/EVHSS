from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import get_password_hash
from src.domain.models import (
    Appointment,
    Client,
    GroomingRecord,
    InventoryItem,
    Organization,
    Pet,
    Role,
    StaffProfile,
    User,
    UserRole,
)
from src.infrastructure.database import AsyncSessionLocal


DEFAULT_ORGANISATION_NAME = "EVHS Main Campus"
DEFAULT_ADMIN_EMAIL = "admin@evhs.com"


async def seed_database() -> None:
    async with AsyncSessionLocal() as db:
        await seed_database_session(db)


async def seed_database_session(db: AsyncSession) -> None:
    organisation = await _get_or_create_organisation(db)
    roles = await _get_or_create_roles(db, organisation.id, ["admin", "vet", "groomer", "staff"])

    admin = await _get_or_create_user(
        db,
        organisation.id,
        email=DEFAULT_ADMIN_EMAIL,
        password="password123",
        first_name="EVHS",
        last_name="Admin",
    )
    await _assign_role(db, organisation.id, admin.id, roles["admin"].id)

    vet = await _get_or_create_user(
        db,
        organisation.id,
        email="vet@evhs.com",
        password="password123",
        first_name="Amara",
        last_name="Ndlovu",
    )
    await _assign_role(db, organisation.id, vet.id, roles["vet"].id)

    groomer = await _get_or_create_user(
        db,
        organisation.id,
        email="groomer@evhs.com",
        password="password123",
        first_name="Maya",
        last_name="Patel",
    )
    await _assign_role(db, organisation.id, groomer.id, roles["groomer"].id)

    sarah = await _get_or_create_client(db, organisation.id, "Sarah", "Connor", "+263771000001", "12 Enterprise Road")
    john = await _get_or_create_client(db, organisation.id, "John", "Smith", "+263771000002", "88 Grooming Avenue")

    buster = await _get_or_create_pet(db, organisation.id, sarah.id, "Buster", "Dog", "Golden Retriever", Decimal("28.50"))
    mochi = await _get_or_create_pet(db, organisation.id, john.id, "Mochi", "Cat", "Tabby", Decimal("4.20"))
    bella = await _get_or_create_pet(db, organisation.id, sarah.id, "Bella", "Dog", "Poodle", Decimal("9.80"))

    await _get_or_create_inventory_item(db, organisation.id, "Rabies Vaccine", "VAC-RABIES", Decimal("50.00"), Decimal("25.00"))
    await _get_or_create_inventory_item(db, organisation.id, "Premium Shampoo", "SPA-SHAMPOO", Decimal("30.00"), Decimal("18.50"))
    await _get_or_create_inventory_item(db, organisation.id, "Flea Medication", "MED-FLEA", Decimal("40.00"), Decimal("12.00"))

    await _get_or_create_staff_profile(db, organisation.id, vet.id, "Veterinarian")
    await _get_or_create_staff_profile(db, organisation.id, groomer.id, "Senior Groomer")

    await _get_or_create_appointment(db, organisation.id, sarah.id, buster.id, vet.id, "Annual wellness exam", 9)
    await _get_or_create_appointment(db, organisation.id, john.id, mochi.id, groomer.id, "Full groom and de-shedding", 11)
    await _get_or_create_appointment(db, organisation.id, sarah.id, bella.id, vet.id, "Dental cleaning consultation", 14)

    await _get_or_create_grooming_record(db, organisation.id, mochi.id, groomer.id)

    await db.commit()


async def _get_or_create_organisation(db: AsyncSession) -> Organization:
    result = await db.execute(select(Organization).where(Organization.name == DEFAULT_ORGANISATION_NAME))
    organisation = result.scalar_one_or_none()
    if organisation:
        return organisation
    organisation = Organization(name=DEFAULT_ORGANISATION_NAME)
    db.add(organisation)
    await db.flush()
    return organisation


async def _get_or_create_roles(db: AsyncSession, organisation_id, names: list[str]) -> dict[str, Role]:
    roles: dict[str, Role] = {}
    for name in names:
        result = await db.execute(
            select(Role).where(Role.organisation_id == organisation_id, Role.name == name)
        )
        role = result.scalar_one_or_none()
        if role is None:
            role = Role(name=name, organisation_id=organisation_id)
            db.add(role)
            await db.flush()
        roles[name] = role
    return roles


async def _get_or_create_user(
    db: AsyncSession,
    organisation_id,
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user:
        return user
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        first_name=first_name,
        last_name=last_name,
        is_active=True,
        organisation_id=organisation_id,
    )
    db.add(user)
    await db.flush()
    return user


async def _assign_role(db: AsyncSession, organisation_id, user_id, role_id) -> None:
    result = await db.execute(
        select(UserRole).where(
            UserRole.organisation_id == organisation_id,
            UserRole.user_id == user_id,
            UserRole.role_id == role_id,
        )
    )
    if result.scalar_one_or_none() is None:
        db.add(UserRole(organisation_id=organisation_id, user_id=user_id, role_id=role_id))
        await db.flush()


async def _get_or_create_client(
    db: AsyncSession,
    organisation_id,
    first_name: str,
    last_name: str,
    phone_number: str,
    address: str,
) -> Client:
    result = await db.execute(
        select(Client).where(Client.organisation_id == organisation_id, Client.phone_number == phone_number)
    )
    client = result.scalar_one_or_none()
    if client:
        return client
    user = await _get_or_create_user(
        db,
        organisation_id,
        email=f"{first_name.lower()}.{last_name.lower()}@example.com",
        password="password123",
        first_name=first_name,
        last_name=last_name,
    )
    client = Client(user_id=user.id, phone_number=phone_number, address=address, organisation_id=organisation_id)
    db.add(client)
    await db.flush()
    return client


async def _get_or_create_pet(
    db: AsyncSession,
    organisation_id,
    client_id,
    name: str,
    species: str,
    breed: str,
    weight: Decimal,
) -> Pet:
    result = await db.execute(
        select(Pet).where(Pet.organisation_id == organisation_id, Pet.client_id == client_id, Pet.name == name)
    )
    pet = result.scalar_one_or_none()
    if pet:
        return pet
    pet = Pet(
        client_id=client_id,
        name=name,
        species=species,
        breed=breed,
        date_of_birth=date.today() - timedelta(days=365 * 3),
        weight=weight,
        organisation_id=organisation_id,
    )
    db.add(pet)
    await db.flush()
    return pet


async def _get_or_create_inventory_item(
    db: AsyncSession,
    organisation_id,
    name: str,
    sku: str,
    stock_quantity: Decimal,
    unit_price: Decimal,
) -> InventoryItem:
    result = await db.execute(select(InventoryItem).where(InventoryItem.sku == sku))
    item = result.scalar_one_or_none()
    if item:
        return item
    item = InventoryItem(
        name=name,
        sku=sku,
        stock_quantity=stock_quantity,
        unit_price=unit_price,
        organisation_id=organisation_id,
    )
    db.add(item)
    await db.flush()
    return item


async def _get_or_create_staff_profile(db: AsyncSession, organisation_id, user_id, job_title: str) -> StaffProfile:
    result = await db.execute(
        select(StaffProfile).where(StaffProfile.organisation_id == organisation_id, StaffProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    if profile:
        return profile
    profile = StaffProfile(user_id=user_id, job_title=job_title, hire_date=date.today(), organisation_id=organisation_id)
    db.add(profile)
    await db.flush()
    return profile


async def _get_or_create_appointment(
    db: AsyncSession,
    organisation_id,
    client_id,
    pet_id,
    vet_id,
    reason: str,
    hour: int,
) -> Appointment:
    appointment_date = datetime.now(timezone.utc).replace(hour=hour, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(Appointment).where(
            Appointment.organisation_id == organisation_id,
            Appointment.pet_id == pet_id,
            Appointment.reason == reason,
        )
    )
    appointment = result.scalar_one_or_none()
    if appointment:
        return appointment
    appointment = Appointment(
        client_id=client_id,
        pet_id=pet_id,
        vet_id=vet_id,
        appointment_date=appointment_date,
        status="scheduled",
        reason=reason,
        organisation_id=organisation_id,
    )
    db.add(appointment)
    await db.flush()
    return appointment


async def _get_or_create_grooming_record(db: AsyncSession, organisation_id, pet_id, groomer_id) -> GroomingRecord:
    result = await db.execute(
        select(GroomingRecord).where(GroomingRecord.organisation_id == organisation_id, GroomingRecord.pet_id == pet_id)
    )
    record = result.scalar_one_or_none()
    if record:
        return record
    record = GroomingRecord(
        pet_id=pet_id,
        groomer_id=groomer_id,
        appointment_date=datetime.now(timezone.utc).replace(hour=11, minute=30, second=0, microsecond=0),
        services_provided="Full groom, de-shedding, nail trim",
        groomer_notes="Initial grooming profile created from seed data.",
        organisation_id=organisation_id,
    )
    db.add(record)
    await db.flush()
    return record
