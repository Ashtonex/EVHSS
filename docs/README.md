# EVHSS Enterprise Platform

Eastern Highlands Veterinary Surgery & Shampooch Dog Grooming Spa

## Overview
This repository contains the foundational enterprise ecosystem built for a modern veterinary practice and professional dog grooming business. 
It includes a public-facing website and an underlying architecture that supports a massive array of future modules including CRM, Clinic Management, Grooming, Billing, Inventory, and HR.

## Directory Structure
- `/backend`: FastAPI Python 3.13 server with Clean Architecture.
- `/frontend`: Next.js 15 React application with Tailwind CSS and shadcn/ui.
- `/docs`: Comprehensive documentation for the enterprise architecture.
- `/database`: Database schema and migration tracking (Alembic).

## Quick Start
1. Ensure Docker and Docker Compose are installed.
2. Run `docker-compose up -d` from the root directory to start Postgres and Redis.
3. For backend development, navigate to `/backend`, activate the venv, and run `uvicorn src.main:app --reload`.
4. For frontend development, navigate to `/frontend` and run `npm run dev`.

Please refer to `DEVELOPER_HANDOFF.md` for guidelines on adding new features.
