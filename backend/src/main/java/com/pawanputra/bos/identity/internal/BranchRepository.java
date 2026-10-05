package com.pawanputra.bos.identity.internal;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, UUID> {

    List<Branch> findAllByOrganizationIdOrderByNameAsc(UUID organizationId);

    Optional<Branch> findByOrganizationIdAndCode(UUID organizationId, String code);
}
