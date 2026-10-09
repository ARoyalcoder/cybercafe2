package com.pawanputra.bos.identity.api;

import java.util.Set;

/**
 * Every permission the application knows, named {@code MODULE_ACTION}. Use these constants wherever a
 * permission is checked so a typo is a compile error:
 *
 * <pre>{@code @PreAuthorize("hasAuthority('" + Permissions.CUSTOMER_VIEW + "')")}</pre>
 *
 * <p>This list and the {@code permissions} table must match; {@code PermissionCatalogIT} fails if
 * they drift. To add a permission: add the constant here, add it to {@link #ALL}, and insert it
 * (plus its grant to {@code SUPER_ADMIN}) in a new Flyway migration.
 */
public final class Permissions {

    public static final String USER_VIEW = "USER_VIEW";
    public static final String USER_CREATE = "USER_CREATE";
    public static final String USER_UPDATE = "USER_UPDATE";
    public static final String USER_DELETE = "USER_DELETE";

    public static final String ROLE_VIEW = "ROLE_VIEW";
    public static final String ROLE_UPDATE = "ROLE_UPDATE";

    public static final String ORGANIZATION_VIEW = "ORGANIZATION_VIEW";
    public static final String ORGANIZATION_UPDATE = "ORGANIZATION_UPDATE";

    public static final String BRANCH_VIEW = "BRANCH_VIEW";
    public static final String BRANCH_CREATE = "BRANCH_CREATE";
    public static final String BRANCH_UPDATE = "BRANCH_UPDATE";
    public static final String BRANCH_DELETE = "BRANCH_DELETE";

    public static final String CATALOG_VIEW = "CATALOG_VIEW";
    public static final String CATALOG_CREATE = "CATALOG_CREATE";
    public static final String CATALOG_UPDATE = "CATALOG_UPDATE";
    public static final String CATALOG_DELETE = "CATALOG_DELETE";

    public static final String CUSTOMER_VIEW = "CUSTOMER_VIEW";
    public static final String CUSTOMER_CREATE = "CUSTOMER_CREATE";
    public static final String CUSTOMER_UPDATE = "CUSTOMER_UPDATE";
    public static final String CUSTOMER_DELETE = "CUSTOMER_DELETE";
    public static final String CUSTOMER_EXPORT = "CUSTOMER_EXPORT";

    public static final String PROJECT_VIEW = "PROJECT_VIEW";
    public static final String PROJECT_UPDATE = "PROJECT_UPDATE";

    public static final String FINANCE_VIEW = "FINANCE_VIEW";
    public static final String FINANCE_APPROVE = "FINANCE_APPROVE";

    public static final String AUDIT_VIEW = "AUDIT_VIEW";

    public static final Set<String> ALL = Set.of(
            USER_VIEW, USER_CREATE, USER_UPDATE, USER_DELETE,
            ROLE_VIEW, ROLE_UPDATE,
            ORGANIZATION_VIEW, ORGANIZATION_UPDATE,
            BRANCH_VIEW, BRANCH_CREATE, BRANCH_UPDATE, BRANCH_DELETE,
            CATALOG_VIEW, CATALOG_CREATE, CATALOG_UPDATE, CATALOG_DELETE,
            CUSTOMER_VIEW, CUSTOMER_CREATE, CUSTOMER_UPDATE, CUSTOMER_DELETE, CUSTOMER_EXPORT,
            PROJECT_VIEW, PROJECT_UPDATE,
            FINANCE_VIEW, FINANCE_APPROVE,
            AUDIT_VIEW);

    private Permissions() {
    }
}
