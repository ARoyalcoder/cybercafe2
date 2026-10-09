package com.pawanputra.bos.customer.internal;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerNoteRepository extends JpaRepository<CustomerNote, UUID> {

    Page<CustomerNote> findAllByCustomerIdOrderByCreatedAtDescIdDesc(UUID customerId, Pageable pageable);

    Optional<CustomerNote> findByIdAndCustomerId(UUID id, UUID customerId);
}
