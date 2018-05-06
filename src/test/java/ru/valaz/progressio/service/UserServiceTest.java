package ru.valaz.progressio.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import ru.valaz.progressio.Application;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.ProfileRequest;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RecordRepository;
import ru.valaz.progressio.repository.RoleRepository;
import ru.valaz.progressio.repository.UserRepository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@TestPropertySource(properties = {
        "environment=test",
})
public class UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Before
    public void setUp() throws Exception {
    }

    @Test
    public void fullProfileUpdateUserTest() {
        userService.createUser("Mike", "supermike",
                "mike@power.com", "123456");
        Optional<User> user = userRepository.findByUsername("supermike");
        assertTrue(user.isPresent());

        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.setName("Bob");
        profileRequest.setUsername("megabob");
        profileRequest.setEmail("bob@here.com");
        profileRequest.setPassword("654321");

        User newUser = userService.updateUser(user.get(), profileRequest);

        assertTrue(!userRepository.findByUsername("supermike").isPresent());
        assertTrue(!userRepository.findByEmail("mike@power.com").isPresent());

        assertTrue(userRepository.findByUsername("megabob").isPresent());
        assertTrue(userRepository.findByEmail("bob@here.com").isPresent());

        Optional<User> megabob = userRepository.findByUsername("megabob");
        assertTrue(megabob.isPresent());
        assertEquals("Bob", megabob.get().getName());
        assertTrue(passwordEncoder.matches("654321", megabob.get().getPassword()));
    }

    @Test
    public void updateUserTest() {
        userService.createUser("John", "johny",
                "johny@test.com", "123456");
        Optional<User> user = userRepository.findByUsername("johny");
        assertTrue(user.isPresent());

        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.setName("JOHN");
        profileRequest.setUsername("johny");
        profileRequest.setEmail("johny@smth.com");
        profileRequest.setPassword("");

        User newUser = userService.updateUser(user.get(), profileRequest);

        assertTrue(!userRepository.findByEmail("johny@test.com").isPresent());

        assertTrue(userRepository.findByUsername("johny").isPresent());
        assertTrue(userRepository.findByEmail("johny@smth.com").isPresent());

        Optional<User> megabob = userRepository.findByUsername("johny");
        assertTrue(megabob.isPresent());
        assertEquals("JOHN", megabob.get().getName());
        assertTrue(passwordEncoder.matches("123456", megabob.get().getPassword()));
    }

    @Test
    public void generateDemoUser() throws InterruptedException {
        User demoUser = userService.generateDemoUser();

        Optional<User> user = userRepository.findByUsername(demoUser.getUsername());
        assertTrue(user.isPresent());
        assertEquals(demoUser.getEmail(), user.get().getEmail());
        assertEquals(demoUser.getName(), user.get().getName());
        assertTrue(!userRepository.findAllByIsDemo(true).isEmpty());
        assertTrue(!indicatorRepository.findByCreatedBy(demoUser.getId()).isEmpty());
        assertTrue(!recordRepository.findByCreatedBy(demoUser.getId()).isEmpty());
    }

    @Test
    public void expiredDemoUser() throws InterruptedException {
        User demoUser = userService.generateDemoUser();

        TimeUnit.SECONDS.sleep(70);
        userService.removeExpiredDemoUsers();
        assertTrue(!userRepository.existsByUsernameIgnoreCase(demoUser.getUsername()));
        assertTrue(userRepository.findAllByIsDemo(true).isEmpty());
        assertTrue(indicatorRepository.findByCreatedBy(demoUser.getId()).isEmpty());
        assertTrue(recordRepository.findByCreatedBy(demoUser.getId()).isEmpty());
    }
}