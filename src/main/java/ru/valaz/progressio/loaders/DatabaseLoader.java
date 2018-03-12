package ru.valaz.progressio.loaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.valaz.progressio.domain.Indicator;
import ru.valaz.progressio.repositories.IndicatorRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private IndicatorRepository indicatorRepository;

    @Autowired
    public DatabaseLoader(IndicatorRepository indicatorRepository) {
        this.indicatorRepository = indicatorRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.indicatorRepository.save(new Indicator("Joe Biden"));
        this.indicatorRepository.save(new Indicator("President Obama"));
        this.indicatorRepository.save(new Indicator("Crystal Mac"));
        this.indicatorRepository.save(new Indicator("James Henry"));
    }
}
