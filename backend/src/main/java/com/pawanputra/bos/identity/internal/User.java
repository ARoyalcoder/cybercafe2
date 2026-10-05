package com.pawanputra.bos.identity.internal;

import com.pawanputra.bos.identity.api.UserStatus;
import com.pawanputra.bos.platform.persistence.SoftDeletableEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.hibernate.annotations.SQLRestriction;

/**
 * A person who can sign in. Belongs to exactly one organization and optionally to one of its branches
 * (the database rejects a branch from another organization).
 */
@Entity
@Table(name = "users")
@SQLRestriction(SoftDeletableEntity.NOT_DELETED)
public class User extends SoftDeletableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", nullable = false, updatable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    /** Login identifier. Always stored lower-case. */
    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "phone", length = 30)
    private String phone;

    /** Only ever a password hash. {@code null} while the user is {@link UserStatus#INVITED}. */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.INVITED;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserRole> roleAssignments = new HashSet<>();

    protected User() {
        // for JPA
    }

    public User(Organization organization, String email, String fullName) {
        this.organization = organization;
        this.email = normalizeEmail(email);
        this.fullName = fullName;
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    /** No-op if the user already has the role. */
    public void assignRole(Role role) {
        boolean alreadyAssigned = roleAssignments.stream().anyMatch(a -> a.getRole().equals(role));
        if (!alreadyAssigned) {
            roleAssignments.add(new UserRole(this, role));
        }
    }

    public void removeRole(Role role) {
        roleAssignments.removeIf(a -> a.getRole().equals(role));
    }

    public Set<Role> getRoles() {
        return roleAssignments.stream().map(UserRole::getRole).collect(Collectors.toUnmodifiableSet());
    }

    public Organization getOrganization() {
        return organization;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = normalizeEmail(email);
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(Instant lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
