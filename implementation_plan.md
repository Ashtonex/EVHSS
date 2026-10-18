# Comprehensive Operational Implementation Plan: EVHSS Enterprise Platform

This plan details the full end-to-end operational implementation of the **EVHSS (EVHS Veterinary & Shampooch Grooming Enterprise)** system. We will replace all mock/stub endpoints with real, production-ready async database operations, create comprehensive Pydantic schemas, implement clean architecture services/repositories, build a seed data script, and construct all operational frontend interfaces across all 9 enterprise modules.

---

## User Review Required

> [!IMPORTANT]
> **Database & Environment Setup**: The implementation relies on PostgreSQL and Redis (either via the local Docker Compose setup `docker-compose up -d` or direct PostgreSQL instance). The backend service will auto-create all database tables on startup using SQLAlchemy Async Metadata and execute an automated seed script for immediate out-of-the-box operation.

> [!NOTE]
> **Authentication Flow**: Authentication will be converted to real JWT authentication handled by FastAPI (`/api/v1/auth/login`), with session cookies bridged cleanly to Next.js Server Components and Client Components.

---

## Open Questions

> [!NOTE]
> 1. **Default Multi-Tenant Organization**: Should the seed script default to a single multi-tenant organization (e.g., *"EVHS Enterprise Main Campus"*) for all initial demo data?
> 2. **External Messaging Integration**: For WhatsApp notifications, shall we maintain an asynchronous mock log table (`whatsapp_notification_logs`) that logs generated notification payloads cleanly until Twilio/WhatsApp API keys are configured in production?

---

## Proposed Changes

---

### Backend Core, Schemas & Infrastructure

#### [NEW] [schemas.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/domain/schemas.py)
- Create comprehensive Pydantic v2 schemas for all domain entities:
  - **Auth**: `Token`, `LoginRequest`, `UserCreate`, `UserResponse`.
  - **CRM**: `ClientCreate`, `ClientResponse`, `PetCreate`, `PetResponse`.
  - **Clinic**: `AppointmentCreate`, `AppointmentUpdate`, `AppointmentResponse`, `MedicalRecordCreate`, `MedicalRecordResponse`, `VaccinationCreate`, `VaccinationResponse`.
  - **Grooming**: `GroomingRecordCreate`, `GroomingRecordResponse`.
  - **Inventory**: `InventoryItemCreate`, `InventoryItemUpdate`, `InventoryItemResponse`.
  - **Billing & POS**: `InvoiceCreate`, `InvoiceResponse`, `POSTransactionCreate`, `POSTransactionResponse`.
  - **Staff & HR**: `StaffProfileCreate`, `StaffProfileResponse`, `StaffScheduleCreate`, `StaffScheduleResponse`.
  - **System & Analytics**: `AuditEventResponse`, `WhatsAppLogResponse`, `DashboardStats`.

#### [MODIFY] [dependencies.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/api/dependencies.py)
- Replace mock `get_current_user` dependency with a real database lookup query fetching the authenticated `User` record by JWT subject ID.
- Add helper dependency `get_current_active_user` and role-checking helpers.

#### [MODIFY] [security.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/core/security.py)
- Implement bcrypt password hashing, verification, and JWT creation routines.

---

### Backend Repositories & Business Services

#### [NEW] [repositories.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/infrastructure/repositories.py)
- Create Async SQLAlchemy repository classes encapsulating database CRUD operations for:
  - `UserRepository` & `ClientRepository` & `PetRepository`
  - `AppointmentRepository` & `MedicalRecordRepository` & `VaccinationRepository`
  - `GroomingRepository`
  - `InventoryRepository` & `BillingRepository`
  - `StaffRepository` & `AuditRepository`

#### [NEW] [services.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/services/services.py)
- Implement business logic handlers:
  - `BookingService`: Handles public appointment requests, automatically links existing client/pet by phone or creates new profiles, generates initial appointment record, and logs a WhatsApp confirmation dispatch payload.
  - `POSService`: Processes retail transactions, computes totals, updates invoice status to `paid`, and atomically decrements inventory stock quantities.
  - `DashboardService`: Aggregates real-time statistics (appointments today, total registered pets, revenue total, pending requests, 7-day trend chart metrics).

---

### Backend Modular Controllers & Router

#### [MODIFY] [router.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/api/router.py)
- Refactor and replace placeholder inline functions with fully implemented RESTful endpoints connected to repositories and services:
  - **Auth Router**: `POST /auth/login`, `GET /auth/me`
  - **Public Router**: `POST /public/appointments/request`
  - **Clinic Router**: `GET /clinic/appointments`, `POST /clinic/appointments`, `PATCH /clinic/appointments/{id}`, `POST /clinic/medical-records`, `GET /clinic/medical-records`, `POST /clinic/vaccinations`, `GET /clinic/vaccinations`
  - **Grooming Router**: `GET /grooming/records`, `POST /grooming/records`
  - **CRM Router**: `GET /crm/clients`, `POST /crm/clients`, `GET /crm/pets`, `POST /crm/pets`
  - **Inventory Router**: `GET /inventory/items`, `POST /inventory/items`, `PATCH /inventory/items/{id}`
  - **Billing & POS Router**: `GET /billing/invoices`, `POST /billing/invoices`, `POST /billing/pos/transaction`
  - **HR Router**: `GET /hr/staff-profiles`, `POST /hr/staff-profiles`, `GET /hr/schedules`, `POST /hr/schedules`
  - **System Router**: `GET /system/dashboard-stats`, `GET /system/audit-logs`, `GET /system/whatsapp-logs`

#### [NEW] [seed.py](file:///g:/work/ATMCAPPROJECTS/EVHSS/backend/src/seed.py)
- Script to populate default organization (*"EVHS Main Campus"*), admin user (`admin@evhs.com` / `password123`), sample vets, groomers, clients (*Sarah Connor*, *John Smith*), pets (*Buster*, *Mochi*, *Bella*), inventory items (*Rabies Vaccine*, *Premium Shampoo*, *Flea Medication*), and initial appointments.

---

### Frontend API Client & Auth Bridge

#### [NEW] [api.ts](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/lib/api.ts)
- Construct a robust, typed API client using standard `fetch` with base URL configuration (`http://localhost:8000/api/v1`), automatic auth header injection, error parsing, and type definitions.

#### [MODIFY] [actions.ts](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/login/actions.ts)
- Update server actions to authenticate against the FastAPI `/api/v1/auth/login` endpoint, storing the auth token in browser cookies.

#### [MODIFY] [route.ts](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/api/booking/route.ts)
- Proxy public booking requests from `/book` directly to the FastAPI `/api/v1/public/appointments/request` endpoint.

---

### Operational Frontend Module Pages

#### [MODIFY] [layout.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/layout.tsx)
- Unlock all admin sidebar links for full navigation across all modules.

#### [MODIFY] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/page.tsx)
- Connect Command Center dashboard to live FastAPI backend metrics endpoint `/system/dashboard-stats` for live KPIs, trend graphs, and recent activity logs.

#### [MODIFY] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/appointments/page.tsx)
- Enable interactive status updates (Mark Completed, Cancel), real-time filtering (Veterinary vs Shampooch Spa), and a "+ New Appointment" creation dialog.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/clients/page.tsx)
- Build CRM Client & Pet directory page with search bar, owner profiles, pet list, and new client modal.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/medical/page.tsx)
- Build Clinical Medical Records page allowing Vets to filter by pet, enter SOAP medical notes, and record vaccinations.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/grooming/page.tsx)
- Build Shampooch Grooming Log page displaying grooming service history, coat/skin condition notes, and groomer assignments.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/retail/page.tsx)
- Build Inventory & POS Terminal page featuring item stock tables, low stock indicators, and an operational Point-of-Sale checkout calculator.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/billing/page.tsx)
- Build Billing & Invoices management page with invoice status badges (Paid, Unpaid), detailed line items, and invoice generation.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/staff/page.tsx)
- Build Staff Roster & Scheduling page displaying staff profiles, role badges, and a weekly shift scheduling grid.

#### [NEW] [page.tsx](file:///g:/work/ATMCAPPROJECTS/EVHSS/frontend/src/app/admin/audit/page.tsx)
- Build System Audit & Communication Log page showing audit trails (login attempts, record edits) and WhatsApp notification log table.

---

## Verification Plan

### Automated Verification
1. **Backend Endpoint Tests**:
   - Run backend test suite via `pytest` to test authentication, client/pet creation, appointment requests, inventory stock updates, and invoice generation.
   - Command: `cd backend && pytest`

2. **Frontend Build & Lint**:
   - Verify TypeScript compilation and Next.js production build without errors.
   - Command: `cd frontend && npm run build`

### Manual Verification
1. **Public Booking Workflow**:
   - Navigate to `/book`, submit a veterinary request and a grooming spa request.
   - Log into `/admin`, verify requests appear under Command Center recent activity and Weekly Appointments.

2. **Full Admin Operations**:
   - Test logging in via `/login` with credentials `admin@evhs.com` / `password123`.
   - Test full navigation across all newly unlocked modules (CRM Clients, Medical Records, Grooming, Inventory & POS, Billing, Staff, System Audit).
