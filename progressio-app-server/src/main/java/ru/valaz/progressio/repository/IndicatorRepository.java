package ru.valaz.progressio.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.valaz.progressio.model.Indicator;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Long> {
    Optional<Indicator> findById(Long indicatorId);

    Page<Indicator> findByCreatedBy(Long userId, Pageable pageable);

    Page<Indicator> findByCreatedByOrderByUpdatedAtDesc(Long userId, Pageable pageable);

    long countByCreatedBy(Long userId);

    List<Indicator> findByIdIn(List<Long> indicatorIds);

    List<Indicator> findByIdIn(List<Long> indicatorIds, Sort sort);
}
