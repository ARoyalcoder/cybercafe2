package com.pawanputra.bos.identity.internal;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    /** Pass the address through {@link User#normalizeEmail(String)} first; emails are stored lower-case. */
    Optional<User> findByEmail(String email);

    /** For sign-in and authorisation: loads the user with roles and their permissions in one query. */
    @EntityGraph(attributePaths = {"roleAssignments.role.permissions"})
    Optional<User> findWithRolesByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findAllByOrganizationId(UUID organizationId, Pageable pageable);
}
