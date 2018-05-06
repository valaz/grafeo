package ru.valaz.progressio.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.RandomStringGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.valaz.progressio.exeption.AppException;
import ru.valaz.progressio.model.Indicator;
import ru.valaz.progressio.model.Role;
import ru.valaz.progressio.model.RoleName;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.ProfileRequest;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RoleRepository;
import ru.valaz.progressio.repository.UserRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Component
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private IndicatorService indicatorService;

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Value("${demoSessionDurationMinutes:60}")
    private long demoSessionDurationMinutes;

    private RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z').build();

    public User updateUser(User user, ProfileRequest profileRequest) {
        user.setName(profileRequest.getName().trim());
        user.setUsername(profileRequest.getUsername().trim());
        user.setEmail(profileRequest.getEmail().trim());
        if (StringUtils.isNotBlank(profileRequest.getPassword())) {
            user.setPassword(passwordEncoder.encode(profileRequest.getPassword().trim()));
        }

        return userRepository.save(user);
    }

    @Scheduled(fixedRate = 10000)
    public void removeExpiredDemoUsers() {
        List<User> demoUsers = userRepository.findAllByIsDemo(true);
        for (User demoUser : demoUsers) {
            Instant createdAt = demoUser.getCreatedAt();
            Instant now = Instant.now();
            long duration = Duration.between(createdAt, now).abs().toMinutes();
            if (duration >= demoSessionDurationMinutes) {
                List<Indicator> userDemoIndicators = indicatorRepository.findByCreatedBy(demoUser.getId());
                indicatorRepository.deleteAll(userDemoIndicators);
                userRepository.delete(demoUser);
                LOGGER.info("Removed expired demo user: id={}, username={}", demoUser.getId(), demoUser.getUsername());
            }
        }
    }

    public User generateDemoUser() {
        String generatedUsername = generator.generate(10);
        String name = "Demo User";
        String username = "demo_" + generatedUsername;
        String email = username + "@grafeo.me";
        String generatedPassword = generator.generate(20);

        LOGGER.info("Username: {}; password: {}", username, generatedPassword);

        User savedUser = createDemoUser(name, username, email, generatedPassword);
//        savedUser.setIsDemo(true);
//        savedUser = userRepository.save(savedUser);
        List<Indicator> demoIndicators = indicatorService.getDemoIndicators(savedUser);
        for (Indicator demoIndicator : demoIndicators) {
            demoIndicator.setCreatedBy(savedUser.getId());
            demoIndicator.setUpdatedBy(savedUser.getId());
            indicatorRepository.save(demoIndicator);
        }

        return savedUser;
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

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User createDemoUser(String name, String username, String email, String password) {
        User user = new User(name, username,
                email, password);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsDemo(true);

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }


}
