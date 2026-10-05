package com.pawanputra.bos.catalog.internal;

import com.pawanputra.bos.catalog.api.ServiceVerticalCode;
import com.pawanputra.bos.platform.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

/** Read-only reference data, seeded and changed only through Flyway migrations. */
@Entity
@Immutable
@Table(name = "service_verticals")
public class ServiceVertical extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "code", nullable = false, length = 40)
    private ServiceVerticalCode code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "active", nullable = false)
    private boolean active;

    protected ServiceVertical() {
        // for JPA
    }

    public ServiceVerticalCode getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public boolean isActive() {
        return active;
    }
}
