# Database Architecture & ERD

## Enterprise Schema Design

The EVHSS Enterprise Platform utilizes PostgreSQL as its primary datastore.
The schema is designed from Day 1 to support all future modules securely and efficiently.

### Shared Columns
Every major table includes:
- `id`: UUID (Primary Key)
- `created_at`: Timestamp with time zone
- `updated_at`: Timestamp with time zone
- `deleted_at`: Timestamp with time zone (Soft Delete)
- `created_by`: UUID (Foreign Key to users, optional)
- `updated_by`: UUID (Foreign Key to users, optional)
- `organisation_id`: UUID (Multi-tenant support)

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    ORGANISATIONS {
        uuid id PK
        string name
        timestamp created_at
    }

    USERS {
        uuid id PK
        string email
        string hashed_password
        boolean is_active
        string first_name
        string last_name
        uuid organisation_id FK
    }

    ROLES {
        uuid id PK
        string name
        uuid organisation_id FK
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
    }

    CLIENTS {
        uuid id PK
        uuid user_id FK "Nullable, for client portal login"
        string phone_number
        text address
        uuid organisation_id FK
    }

    PETS {
        uuid id PK
        uuid client_id FK
        string name
        string species
        string breed
        date date_of_birth
        numeric weight
    }

    APPOINTMENTS {
        uuid id PK
        uuid client_id FK
        uuid pet_id FK
        uuid vet_id FK "References users"
        datetime appointment_date
        string status
    }

    MEDICAL_RECORDS {
        uuid id PK
        uuid pet_id FK
        uuid vet_id FK
        uuid appointment_id FK
        text notes
    }

    GROOMING_APPOINTMENTS {
        uuid id PK
        uuid pet_id FK
        uuid groomer_id FK
        datetime appointment_date
        string status
    }

    PRODUCTS {
        uuid id PK
        string name
        numeric price
        integer stock_quantity
    }

    INVOICES {
        uuid id PK
        uuid client_id FK
        numeric total_amount
        string status
    }

    ORGANISATIONS ||--o{ USERS : "has"
    USERS ||--o{ USER_ROLES : "assigned to"
    ROLES ||--o{ USER_ROLES : "contains"
    
    USERS ||--o{ CLIENTS : "linked to portal account"
    CLIENTS ||--o{ PETS : "owns"
    
    CLIENTS ||--o{ APPOINTMENTS : "books"
    PETS ||--o{ APPOINTMENTS : "attends"
    USERS ||--o{ APPOINTMENTS : "veterinarian conducts"
    
    PETS ||--o{ MEDICAL_RECORDS : "has"
    APPOINTMENTS ||--o{ MEDICAL_RECORDS : "generates"
    
    CLIENTS ||--o{ INVOICES : "billed to"
```

## Security & Row Level Security (RLS)
As we are designing for potential Supabase usage, Row Level Security policies will be used to ensure that users (and external portal users) can only access data where `organisation_id` matches their own context, and `client_id` matches their portal user ID.
