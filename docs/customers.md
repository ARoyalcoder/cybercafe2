# Customer management

The people and companies the business works with. This is the record every later module (leads,
quotations, projects, invoices, tickets) attaches to.

## Model

```
Customer ──< Contact        people at the customer; one is the primary contact
    │    ──< Address        billing / service / other; one default per type
    │    ──< Note           written once, can be removed
    └──>< Tag               free-form labels the organization invents
```

| Thing | Notes |
| --- | --- |
| **Customer** | `INDIVIDUAL` (first and last name) or `BUSINESS` (company name, GSTIN). Has a customer number (`CUS-001001`), status, source, an assigned employee and tags. Belongs to one organization |
| **Contact** | Name, designation, phone, email. The first contact is the primary one; making another primary moves the title |
| **Address** | Type `BILLING`, `SERVICE` or `OTHER`. A customer can have several of each. The first of a type is its default; billing and service defaults are independent |
| **Tag** | Created the first time someone types a new name. Unique per organization, ignoring case |
| **Note** | Records its author's name at the time. Not editable |

| Field | Values |
| --- | --- |
| Status | `PROSPECT`, `ACTIVE` (default), `INACTIVE`, `BLOCKED` |
| Source | `WALK_IN`, `REFERRAL`, `WEBSITE`, `PHONE_CALL`, `SOCIAL_MEDIA`, `ADVERTISEMENT`, `PARTNER`, `OTHER` |
| Assigned employee | Must be an active user of the same organization |

Deleting a customer is a soft delete: it disappears from lists and from duplicate detection, and stays
in the database for the records that refer to it.

## Duplicate detection

Before a customer is saved, the system looks for existing customers that may be the same one.

| Compared | How | Also checked on |
| --- | --- | --- |
| **Phone** | Digits only, last 10: `+91 98765-43210`, `09876543210` and `9876543210` are the same number | the customer's contacts |
| **Email** | Ignoring case and surrounding spaces | the customer's contacts |
| **Company name** | Ignoring case, punctuation, and legal-form words at the end (`Pvt`, `Private`, `Ltd`, `Limited`, `LLP`, `LLC`, `Inc`, `Co`, `Company`, `Corp`): `Acme Solar Pvt. Ltd.` matches `ACME SOLAR` | |

How it is enforced:

1. The form calls `POST /customers/duplicate-check` when the user saves. If anything matches, it shows
   the existing customers and why each matched (`same phone`, `same email`, `same company name`),
   with a link to open each one.
2. The user either goes back, or chooses **Save anyway**, which sends `confirmDuplicates: true`.
3. The server applies the same rule itself: a create without that flag is refused with
   `409 POSSIBLE_DUPLICATE` if a match exists. A client that skips step 1 cannot create duplicates
   by accident.

Details:

- Only live customers of the **same organization** are compared.
- When **editing**, the check runs only if the phone, email or company name changed, and never
  matches the customer against itself.
- A match is a warning for a person to judge, not proof. Two people can share a landline; a group can
  have several companies. That is why it can be overridden.
- Matching is exact on the normalised value. It does not catch typos ("Acme Solr") or a person's name
  entered twice with no phone or email. Fuzzy matching and merging two customers are not built.
- Adding a **contact** with a phone or email that belongs to another customer is not blocked; it is
  found the next time someone enters that phone or email as a new customer.

## List

`/customers` (menu: Customers). Needs `CUSTOMER_VIEW`.

- **Search**: name, customer number, email, phone (in any format), company name.
- **Filters**: type, status, source, assigned employee, tag.
- **Sort**: name, newest/oldest, customer number, status.
- **Pagination**, with search, filters, sort and page kept in the URL.
- **Export CSV**: the whole filtered list in the chosen order, not just the visible page. Needs the
  separate permission `CUSTOMER_EXPORT`. Every export is written to the audit log with who did it,
  the filters used and the number of rows. At most 20,000 rows per export; beyond that the user is
  asked to narrow the filters. Cells that a spreadsheet would run as a formula (starting with
  `=`, `+`, `-`, `@`) are prefixed with an apostrophe, so phone numbers like `+91…` appear with a
  leading `'` in the raw file.

## Profile

`/customers/:id`, one tab per subject; the open tab is in the URL (`?tab=contacts`).

| Tab | Status |
| --- | --- |
| Overview | Details and notes |
| Contacts | List, add, edit, remove, choose the primary |
| Addresses | List, add, edit, remove, choose the default per type |
| Activities | The customer's history, including changes to its contacts, addresses, notes and tags |
| Leads, Opportunities, Quotations, Orders, Projects, Invoices, Payments, Tickets, AMC, Warranty, Documents | **Not built.** Each tab is present and says so. It is filled in when its module is built |

### Plugging a module into the profile

The tabs are a list in `frontend/src/features/customers/profile/tabs.tsx`. A module adds its tab by
replacing its placeholder line:

```tsx
// before
notBuilt('leads', 'Leads', 'leads'),
// after
{ key: 'leads', label: 'Leads', component: CustomerLeadsTab },
```

Its component receives the customer (`{ customer }`) and fetches its own data, typically from an
endpoint of its own module filtered by `customerId`. On the backend the module stores the customer's
id (no foreign key across modules, like every other cross-module reference) and nothing in the
customer module changes.

## Permissions

| Permission | Allows | Default roles |
| --- | --- | --- |
| `CUSTOMER_VIEW` | List, profile, contacts, addresses, notes, activity | Super Admin, Admin, Director, Sales Manager, Sales Executive, Project Manager, Finance, Support Agent |
| `CUSTOMER_CREATE` | Create a customer | Super Admin, Admin, Sales Manager, Sales Executive |
| `CUSTOMER_UPDATE` | Edit a customer; add, edit and remove contacts, addresses and notes | Super Admin, Admin, Sales Manager, Sales Executive |
| `CUSTOMER_DELETE` | Delete a customer | Super Admin, Admin, Sales Manager |
| `CUSTOMER_EXPORT` | Export the list | Super Admin, Admin, Director, Sales Manager |

Everyone with `CUSTOMER_VIEW` sees **all** customers of their organization. "Assigned employee" says
who looks after a customer; it does not restrict who can see it. Limiting sales staff to their own
customers is not built.

A customer's own Activities tab needs only `CUSTOMER_VIEW`. The full audit log needs `AUDIT_VIEW`.

## API

All under `/api/v1/customers`.

| Endpoint | Permission |
| --- | --- |
| `GET /` (`search`, `type`, `status`, `source`, `assignedTo`, `tagId`, `sort`, `page`, `size`) | `CUSTOMER_VIEW` |
| `GET /export` (same filters and sort) | `CUSTOMER_EXPORT` |
| `GET /tags`, `GET /assignees` | `CUSTOMER_VIEW` |
| `POST /duplicate-check` | `CUSTOMER_CREATE` or `CUSTOMER_UPDATE` |
| `POST /`, `PUT /{id}` | `CUSTOMER_CREATE` / `CUSTOMER_UPDATE` |
| `DELETE /{id}` | `CUSTOMER_DELETE` |
| `GET /{id}`, `GET /{id}/activity` | `CUSTOMER_VIEW` |
| `GET /{id}/contacts`, `/addresses`, `/notes` | `CUSTOMER_VIEW` |
| `POST`, `PUT`, `DELETE` on `/{id}/contacts`, `/addresses`; `POST`, `DELETE` on `/{id}/notes` | `CUSTOMER_UPDATE` |

Edits send the `version` that was loaded; a stale one is `409 CONFLICT`. A customer, contact, address
or note of another organization is `404`.

## For other modules

- Refer to a customer by its id. Do not join to the customer tables or add a foreign key to them.
- Auditing is automatic: `Customer`, `Contact`, `Address`, `Note` and `Tag` are `@Audited`, and the
  parts file their activity under the customer (see `ActivityOwner` in [audit.md](audit.md)).
- `UserDirectory` (identity module) is how a module validates and names an assigned employee.

## Not built

Merging duplicates, fuzzy matching, bulk import, per-user visibility, custom fields, configurable
status or source lists (they are fixed enums; changing them needs a migration), document storage
for the Documents tab, and all the modules behind the placeholder tabs.
