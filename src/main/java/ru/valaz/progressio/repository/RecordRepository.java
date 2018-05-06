package ru.valaz.progressio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.valaz.progressio.model.Record;

import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    Page<Record> findByCreatedBy(Long userId, Pageable pageable);

    List<Record> findByCreatedBy(Long userId);

    long countByCreatedBy(Long userId);
}
