package com.pawanputra.bos.catalog.internal;

import com.pawanputra.bos.platform.persistence.SoftDeletableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLRestriction;

/**
 * One service the company sells (a row of the {@code services} table). Named "offering" in code
 * because {@code Service} collides with Spring's {@code @Service}.
 */
@Entity
@Table(name = "services")
@SQLRestriction(SoftDeletableEntity.NOT_DELETED)
public class ServiceOffering extends SoftDeletableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    /** {@code UPPER_SNAKE_CASE}, unique across the whole catalog. */
    @Column(name = "code", nullable = false, length = 60)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    protected ServiceOffering() {
        // for JPA
    }

    public ServiceOffering(ServiceCategory category, String code, String name) {
        this.category = category;
        this.code = code;
        this.name = name;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    /** Move the service to another category (of any vertical). */
    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
