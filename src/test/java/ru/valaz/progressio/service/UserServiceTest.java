package ru.valaz.progressio.service;

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
import ru.valaz.progressio.repository.UserRepository;

import java.util.Optional;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

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
}