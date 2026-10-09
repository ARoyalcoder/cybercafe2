package com.pawanputra.bos.audit.api;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Lets a module show the history of its own records to its own users. The audit screen needs
 * {@code AUDIT_VIEW}; a module that exposes a record's timeline through its own endpoint decides
 * for itself who may see it (usually whoever may view the record).
 */
public interface ActivityFeed {

    /**
     * @param changes field-level changes, each with {@code field}, {@code from} and {@code to}; empty if none
     */
    record ActivityItem(
            UUID id, Instant occurredAt, AuditAction action, String actorLabel, String message,
            List<Map<String, Object>> changes) {
    }

    /** The timeline of one record, newest first, limited to the given organization. */
    Page<ActivityItem> forEntity(UUID organizationId, String entityType, String entityId, Pageable pageable);
}
