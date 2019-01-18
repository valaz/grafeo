package ru.valaz.grafeo.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import ru.valaz.grafeo.Application;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.LoginRequest;
import ru.valaz.grafeo.payload.SignUpRequest;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class AuthControllerTest extends AbstractControllerTest {

    static final String API_AUTH_PREFIX = "/api/auth";

    @Test
    public void loginTest() throws Exception {
        userService.createUser("Auth Test", "auth",
                "auth@grafeo.me", "123456");
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("auth");
        loginRequest.setPassword("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());
    }

    @Test
    public void signupTest() throws Exception {
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("Signup Test");
        signUpRequest.setUsername("signup");
        signUpRequest.setEmail("signup@grafeo.me");
        signUpRequest.setPassword("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/signup")
                .content(json(signUpRequest))
                .contentType(contentType))
                .andExpect(status().isCreated());

        Optional<User> signupUser = userRepository.findByUsername("signup");
        assertTrue(signupUser.isPresent());
        assertEquals("Signup Test", signupUser.get().getName());
        assertEquals("signup@grafeo.me", signupUser.get().getEmail());
        assertTrue(passwordEncoder.matches("123456", signupUser.get().getPassword()));
    }

    @Test
    public void errorSignupTest() throws Exception {
        userService.createUser("Signup Test", "signup_err_username",
                "signup_err_username@grafeo.me", "123456");

        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("Signup Test");
        signUpRequest.setUsername("signup_err_username");
        signUpRequest.setEmail("signup_err_username@grafeo.me");
        signUpRequest.setPassword("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/signup")
                .content(json(signUpRequest))
                .contentType(contentType))
                .andExpect(status().isBadRequest());
    }
}