# Security Implementation Guide

## OWASP Top 10 Protections Implemented

### 1. Broken Access Control
- All private endpoints implement Role-Based Access Control (RBAC).
- Row Level Security (RLS) is designed into the PostgreSQL schema to ensure multi-tenant data isolation (`organisation_id`).

### 2. Cryptographic Failures
- Passwords are never stored in plaintext. They are hashed using bcrypt (`passlib`).
- JWT tokens are signed using HS256 with strong secrets injected via Environment Variables.

### 3. Injection
- SQLAlchemy 2.0 ORM is used exclusively for all database interactions. No raw SQL strings are concatenated, mitigating SQL injection risks.

### 4. Insecure Design
- The system is architected with a "secure by default" philosophy, separating domain logic from API delivery.

### 5. Security Misconfiguration
- FastAPI CORS middleware is strictly configured to only allow requests from known frontend origins (e.g. `http://localhost:3000`).

## Authentication Flow
1. Client POSTs email and password to `/api/v1/auth/login`.
2. Server validates credentials against the hashed password in DB.
3. Server issues a JWT with `sub` (user_id) and `exp` (expiration).
4. Client passes JWT in the `Authorization` header for subsequent requests.

## Data Privacy
- Soft Deletes are used across all major tables via `deleted_at`. Data is never permanently purged unless specifically mandated by a GDPR/POPIA compliant purge job.
