package app.grafeo.service;

import app.grafeo.exeption.AppException;
import app.grafeo.repository.RoleRepository;
import app.grafeo.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import app.grafeo.model.Role;
import app.grafeo.model.RoleName;
import app.grafeo.model.User;
import app.grafeo.payload.ProfileRequest;

import java.util.Collections;

@Component
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    public User updateUser(User user, ProfileRequest profileRequest) {
        user.setName(profileRequest.getName().trim());
        user.setUsername(profileRequest.getUsername().trim());
        user.setEmail(profileRequest.getEmail().trim());
        if (StringUtils.isNotBlank(profileRequest.getPassword())) {
            user.setPassword(passwordEncoder.encode(profileRequest.getPassword().trim()));
        }

        return userRepository.save(user);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User createUser(String name, String username, String email, String password) {
        User user = new User(name, username,
                email, password);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }


}
