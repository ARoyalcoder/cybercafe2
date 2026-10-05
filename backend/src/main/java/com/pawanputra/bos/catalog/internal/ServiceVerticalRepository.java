package com.pawanputra.bos.catalog.internal;

import com.pawanputra.bos.catalog.api.ServiceVerticalCode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.Repository;

/** Read-only on purpose: extends the marker {@link Repository} so no save/delete methods exist. */
public interface ServiceVerticalRepository extends Repository<ServiceVertical, UUID> {

    List<ServiceVertical> findAllByActiveTrueOrderByDisplayOrderAsc();

    Optional<ServiceVertical> findByCode(ServiceVerticalCode code);
}
