# Enterprise Architecture

## Clean Architecture Principles
The entire backend ecosystem is built upon Clean Architecture and SOLID principles.

### Layers
1. **Domain Layer**: Contains enterprise business rules, entities, and basic models (`src/domain`). It has absolutely zero dependencies on outer layers.
2. **Use Case / Service Layer**: Contains application-specific business rules (`src/services`). It implements the logic orchestrating the flow of data to and from the entities.
3. **Interface Adapters / API Layer**: Defines how data is received and sent over the web (`src/api`). Includes REST controllers and FastAPI routing.
4. **Infrastructure Layer**: Contains database repositories, caching logic, and integrations with external services like Email, SMS, etc. (`src/infrastructure`).

## Frontend Architecture
The Next.js frontend uses a Feature-Based Architecture:
- `src/components/ui`: Reusable generic UI components (shadcn/ui).
- `src/components/features`: Domain-specific components (e.g., `AppointmentForm`).
- `src/app`: Page routing and API handlers.
- `src/lib`: Shared utilities, API clients (Axios/fetch wrappers), and global state (Zustand or React Context).

## Dependency Injection
We use FastAPI's native `Depends` system for injecting repositories and services into the API controllers, ensuring high testability and modularity.
