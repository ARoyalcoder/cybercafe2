package com.pawanputra.bos.catalog.internal;

import com.pawanputra.bos.catalog.api.ServiceVerticalCode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, UUID> {

    List<ServiceCategory> findAllByVerticalCodeOrderByDisplayOrderAscNameAsc(ServiceVerticalCode verticalCode);

    Optional<ServiceCategory> findByVerticalCodeAndCode(ServiceVerticalCode verticalCode, String code);
}
