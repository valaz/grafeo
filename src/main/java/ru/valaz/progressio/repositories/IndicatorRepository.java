package ru.valaz.progressio.repositories;


import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.valaz.progressio.domain.Indicator;

@RepositoryRestResource
public interface IndicatorRepository extends CrudRepository<Indicator, Long> {
}
