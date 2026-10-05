package com.pawanputra.bos.catalog.internal;

import com.pawanputra.bos.catalog.api.ServiceVerticalCode;
import com.pawanputra.bos.platform.error.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ServiceVerticalService {

    private final ServiceVerticalRepository repository;

    public ServiceVerticalService(ServiceVerticalRepository repository) {
        this.repository = repository;
    }

    public List<ServiceVertical> listActive() {
        return repository.findAllByActiveTrueOrderByDisplayOrderAsc();
    }

    public ServiceVertical getByCode(String code) {
        return ServiceVerticalCode.fromCode(code)
                .flatMap(repository::findByCode)
                .orElseThrow(() -> new ResourceNotFoundException("Service vertical", code));
    }
}
