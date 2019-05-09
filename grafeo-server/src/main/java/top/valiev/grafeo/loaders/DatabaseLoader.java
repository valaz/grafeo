package top.valiev.grafeo.loaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import top.valiev.grafeo.model.Role;
import top.valiev.grafeo.model.RoleName;
import top.valiev.grafeo.repository.RoleRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private RoleRepository roleRepository;

    @Autowired
    public DatabaseLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        if (this.roleRepository.findAll().isEmpty()) {
            this.roleRepository.save(new Role(RoleName.ROLE_ADMIN));
            this.roleRepository.save(new Role(RoleName.ROLE_USER));
        }
    }
}
