# Database

PostgreSQL is the source of truth. Flyway owns the schema; Hibernate validates its mappings against
it at start-up (`ddl-auto: validate`) and never changes it.

## Migrations

Location: `backend/src/main/resources/db/migration`

| Version | File | Contents |
| --- | --- | --- |
| 1 | `V1__organizations_and_branches.sql` | `organizations`, `branches` |
| 2 | `V2__users_roles_permissions.sql` | `users`, `roles`, `permissions`, `role_permissions`, `user_roles` |
| 3 | `V3__service_catalog.sql` | `service_verticals`, `service_categories`, `services` |
| 4 | `V4__seed_service_verticals.sql` | The six service verticals |
| 5 | `V5__authentication.sql` | Login lock columns on `users`; `user_sessions`, `refresh_tokens`, `password_reset_tokens`; permission codes become `MODULE_ACTION` |
| 6 | `V6__seed_roles_and_permissions.sql` | The 13 system roles, the permission catalogue, and the default grants |
| 9 | `V9__customers.sql` | `customers`, `customer_contacts`, `customer_addresses`, `customer_tags`, `customer_tag_assignments`, `customer_notes`; the `CUSTOMER_EXPORT` permission |
| 8 | `V8__audit_and_activity.sql` | `audit_logs` (append-only, enforced by trigger), `entity_activity_logs`, the `AUDIT_VIEW` permission |
| 7 | `V7__organization_and_catalog_configuration.sql` | Branch city/state required and indexed; verticals editable (`version`, `updated_by`); service configuration columns (`billing_type`, `unit_label`, `base_price`, `requires_site_visit`, `estimated_duration_days`) |

Rules:

- Migrations run automatically at application start-up. A failed migration stops the application.
- Never edit or delete a migration that has been merged; add a new one. Flyway checks checksums.
- One concern per file, named `V<next>__<what_it_does>.sql`.
- Schema changes and seed/reference data go in separate files.
- Every constraint and index gets an explicit name (see below) so errors and tests can refer to it.

## Tables

```
organizations ──< branches
      │              │
      └──< users >───┘ (optional home branch, must belong to the user's organization)
             │
             └──< user_roles >── roles ──< role_permissions >── permissions

service_verticals ──< service_categories ──< services
```

| Table | Module | Soft delete | Status field | Notes |
| --- | --- | --- | --- | --- |
| `organizations` | identity | yes | `status` (ACTIVE, INACTIVE) | Code unique among live rows |
| `branches` | identity | yes | `active` | Code unique per organization; at most one `head_office` per organization |
| `users` | identity | yes | `status` (INVITED, ACTIVE, SUSPENDED, DISABLED) | Email is the login id: lower-case, unique among live users |
| `roles` | identity | no | `active` | `system_role` marks roles that ship with the product. A role still assigned to a user cannot be deleted |
| `permissions` | identity | no | `active` | Defined by the application through migrations; code is `MODULE_ACTION`, e.g. `CUSTOMER_VIEW` |
| `role_permissions` | identity | no | none | Join table, composite primary key |
| `user_roles` | identity | no | none | One row per grant; records who granted it and when |
| `user_sessions` | identity | no | `revoked_at` + `revoked_reason` | One row per sign-in (device); records IP and user agent |
| `refresh_tokens` | identity | no | `used_at` | Chain of single-use tokens per session; hash only |
| `password_reset_tokens` | identity | no | `used_at` | Single-use, short-lived; hash only |
| `customers` | customer | yes | `status` (PROSPECT, ACTIVE, INACTIVE, BLOCKED) | Organization-scoped. `*_key` columns hold normalised phone and company name for duplicate detection. See [customers.md](customers.md) |
| `customer_contacts`, `customer_addresses`, `customer_notes` | customer | no (removed for real, and audited) | none | Deleted with their customer; at most one primary contact, one default address per type |
| `customer_tags`, `customer_tag_assignments` | customer | no | none | Tag names unique per organization, ignoring case |
| `audit_logs` | audit | no | none | Append-only: the database refuses `UPDATE` and `DELETE`. No foreign keys, by design. See [audit.md](audit.md) |
| `entity_activity_logs` | audit | no | none | Per-record timeline; links to its `audit_logs` row |
| `service_verticals` | catalog | no | `active` | Closed set of six, fixed by a CHECK constraint |
| `service_categories` | catalog | yes | `active` | Code and name unique within a vertical |
| `services` | catalog | yes | `active` | Code unique across the whole catalog; name unique within a category |

Seed data: the six verticals, the 13 system roles, the permission catalogue and the default grants
(see [security.md](security.md#default-role-matrix)). No organizations or users are seeded; the first
administrator is created at start-up from environment variables
(see [security.md](security.md#first-administrator)).

Sessions and reset tokens that ended more than 90 days ago are deleted nightly by `AuthHousekeepingJob`.

## Conventions

### Columns

| Column | Type | On | Meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | every entity table | Primary key. Generated by the application; the column default covers manual SQL |
| `created_at`, `updated_at` | `timestamptz` | every entity table | UTC. Set by JPA auditing |
| `created_by`, `updated_by` | `varchar(100)` | data that people edit | Actor: the signed-in user's identifier, or `system` for jobs and unauthenticated code |
| `version` | `bigint` | data that people edit | Optimistic lock. A stale update fails and reaches the client as `409 CONFLICT` |
| `deleted_at` | `timestamptz` | soft-deletable tables | `NULL` = live row |
| `active` / `status` | `boolean` / `varchar` + CHECK | all tables with a lifecycle | `active` for on/off; `status` when there are more than two states |

Other rules:

- Table names are plural `snake_case`; columns are `snake_case`.
- Text is `varchar(n)` with a deliberate limit. Enumerated values are `varchar` with a CHECK
  constraint and a Java enum persisted by name; no PostgreSQL enum types (they are awkward to migrate).
- Timestamps are always `timestamptz`.

### Soft delete

Used where other records or history will keep pointing at the row (people, organizations, catalog
items). Not used for join tables, or for reference data that is switched off with `active` instead.

- "Delete" sets `deleted_at` (`entity.markDeleted(clock.instant())`); the row stays.
- Soft-deletable entities carry `@SQLRestriction("deleted_at is null")`, so deleted rows vanish from
  every query and association without each query having to remember the filter.
- Uniqueness is enforced on live rows only, through partial unique indexes
  (`... WHERE deleted_at IS NULL`). A deleted user's email or a deleted service's code can be reused.
- Do not call `repository.delete(...)` on these entities.

### Constraint and index names

| Kind | Pattern | Example |
| --- | --- | --- |
| Primary key | `pk_<table>` | `pk_users` |
| Foreign key | `fk_<table>_<target>` | `fk_users_organization` |
| Unique | `uq_<table>_<columns>` | `uq_users_email` |
| Check | `ck_<table>_<rule>` | `ck_users_status` |
| Index | `ix_<table>_<columns>` | `ix_user_roles_role` |

### Foreign keys and indexes

- Every relationship is a real foreign key. The default is to block deleting a referenced row;
  `ON DELETE CASCADE` is used only for rows that have no meaning without their parent
  (`user_roles` of a user, `role_permissions`).
- Every foreign key column is the leading column of an index. `SchemaMigrationIT` fails if one is not.
- `users` references `branches` with a composite key `(branch_id, organization_id)`, so the database
  itself guarantees that a user's branch belongs to the user's organization.
- Foreign keys do not cross module boundaries (see [architecture.md](architecture.md)).
- The audit tables are the exception to "every relationship is a foreign key": they refer to actors
  and records by plain id so an audit row outlives what it describes. They are also read and written
  with JDBC rather than JPA entities (see [audit.md](audit.md)).

## Entities

Base classes in `platform.persistence`:

| Class | Adds | Use for |
| --- | --- | --- |
| `BaseEntity` | `id`, `createdAt`, `updatedAt`, id-based `equals`/`hashCode` | Application-defined data (`Permission`, `ServiceVertical`) |
| `AuditableEntity` | `createdBy`, `updatedBy`, `version` | Data people edit that is not soft-deleted (`Role`) |
| `SoftDeletableEntity` | `deletedAt`, `markDeleted()` | `Organization`, `Branch`, `User`, `ServiceCategory`, `ServiceOffering` |

Mapping rules:

- Entities live in a module's `internal` package and never leave it.
- Associations are `LAZY`. Load what a use case needs with an `@EntityGraph` or a fetch join.
- `services` is mapped by the class `ServiceOffering`, because `Service` collides with Spring's `@Service`.
- `ServiceVertical` has no public constructor and its repository has no insert or delete: the six rows
  can be edited (name, description, order, active) but never added or removed by the application.
- `User` stores only a password hash. `User.normalizeEmail` lower-cases and trims; the database
  rejects any email that is not lower-case.

## Checking the schema

`SchemaMigrationIT` verifies the migrated schema directly (tables, UUID keys, timestamps, soft-delete
columns, seed data, the six-vertical CHECK, indexed foreign keys). `IdentityPersistenceIT` and
`CatalogPersistenceIT` exercise the mappings and each constraint. See
[development.md](development.md#tests) for how to run them.
