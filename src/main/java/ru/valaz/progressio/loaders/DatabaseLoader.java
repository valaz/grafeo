package ru.valaz.progressio.loaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.valaz.progressio.model.Indicator;
import ru.valaz.progressio.model.Role;
import ru.valaz.progressio.model.RoleName;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RoleRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private IndicatorRepository indicatorRepository;

    private RoleRepository roleRepository;

    @Autowired
    public DatabaseLoader(IndicatorRepository indicatorRepository, RoleRepository roleRepository) {
        this.indicatorRepository = indicatorRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.indicatorRepository.save(new Indicator("Joe Biden"));
        this.indicatorRepository.save(new Indicator("President Obama"));
        this.indicatorRepository.save(new Indicator("Crystal Mac"));
        this.indicatorRepository.save(new Indicator("James Henry"));

        this.roleRepository.save(new Role(RoleName.ROLE_ADMIN));
        this.roleRepository.save(new Role(RoleName.ROLE_USER));
    }
}
