package com.pawanputra.bos.catalog.internal;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, UUID> {

    Optional<ServiceOffering> findByCode(String code);

    List<ServiceOffering> findAllByCategoryIdOrderByDisplayOrderAscNameAsc(UUID categoryId);
}
