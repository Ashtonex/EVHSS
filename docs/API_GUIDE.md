# API Guide

## Overview
The EVHSS Enterprise API is built with FastAPI.
The base URL for all endpoints is `/api/v1`.

## Authentication
Most endpoints require a valid JWT passed in the `Authorization` header as a Bearer token.
```http
Authorization: Bearer <your-jwt-token>
```

## Available Modules (Phase 1 placeholders included)

### 1. Authentication
* `POST /api/v1/auth/login`: Authenticate and receive a JWT.

### 2. Clinic (Veterinary)
* `GET /api/v1/clinic/appointments`: List upcoming vet appointments.
* `POST /api/v1/clinic/medical-records`: Add a new medical record.

### 3. Grooming (Shampooch)
* `GET /api/v1/grooming/appointments`: List grooming spa appointments.

### 4. CRM
* `GET /api/v1/crm/clients`: Retrieve all clients and their linked pets.

### 5. Inventory
* `GET /api/v1/inventory/products`: Retrieve all retail and medical products.

### 6. HR
* `GET /api/v1/hr/staff`: List all staff members.

## OpenAPI Documentation
When running the backend locally, navigate to `http://localhost:8000/docs` to view the interactive Swagger UI, generated dynamically from the FastAPI routers and Pydantic schemas.
