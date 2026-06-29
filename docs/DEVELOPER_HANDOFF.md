# Developer Handoff Guide

## Welcome to the EVHSS Enterprise Platform

This project is designed with massive scale and 10+ years of maintainability in mind.
Every design decision ensures that new developers can safely add features without modifying the core system.

## Adding a New Module

The architecture mandates that modules (like CRM, Inventory, Billing) are strictly separated in logic but share the core identity and database layer.

### 1. Database Schema
1. Add new SQLAlchemy models to `backend/src/domain/models.py`.
2. Ensure every model inherits from `Base`, `TimestampMixin`, `AuditMixin`, and `OrganizationMixin`.
3. Generate the migration using Alembic: `alembic revision --autogenerate -m "Added Inventory module"`
4. Review the generated migration and run `alembic upgrade head`.

### 2. Business Logic (Services & Repositories)
1. Add an interface to `src/infrastructure` for your data access.
2. Implement your business rules in `src/services`. No framework-specific (FastAPI) code should exist here.

### 3. API Controllers
1. Add new endpoints in `src/api/routers`.
2. Inject your services using FastAPI's `Depends()`.
3. Add the router to `src/main.py`. The Swagger docs will automatically update.

## Frontend (Next.js)

1. Ensure strict adherence to the brand color palettes defined in `tailwind.config.ts`.
2. Place all reusable UI components in `src/components/ui`.
3. Feature-specific components belong in `src/components/features`.
4. Create pages using Next.js App Router in `src/app/`. Use `layout.tsx` for nested layouts.

## Security
- All endpoints must be protected using JWT middleware, except for public routes.
- RBAC validation should be performed at the API layer before passing to the Service layer.
