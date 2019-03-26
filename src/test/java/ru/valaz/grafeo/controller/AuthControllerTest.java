package ru.valaz.grafeo.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import ru.valaz.grafeo.Application;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.FBLoginRequest;
import ru.valaz.grafeo.payload.LoginRequest;
import ru.valaz.grafeo.payload.SignUpRequest;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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
    public void fbSignupTest() throws Exception {
        FBLoginRequest fbSignUpRequest = new FBLoginRequest();
        fbSignUpRequest.setName("Facebook Signup");
        fbSignUpRequest.setEmail("fb_signup@grafeo.pro");
        fbSignUpRequest.setUserId("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/fb/login")
                .content(json(fbSignUpRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        Optional<User> signupUser = userRepository.findByUsername("fb_signup@grafeo.pro");
        assertTrue(signupUser.isPresent());
        assertEquals("Facebook Signup", signupUser.get().getName());
        assertEquals("fb_signup@grafeo.pro", signupUser.get().getEmail());
        assertEquals("123456", signupUser.get().getFacebookUserId());
    }

    @Test
    public void fbLoginTest() throws Exception {
        User facebook_login = userService.createUser("Facebook Login", "fb_signin@grafeo.pro",
                "fb_signin@grafeo.pro", "123456");
        facebook_login.setFacebookUserId("123456");
        userRepository.save(facebook_login);

        FBLoginRequest fbSignUpRequest = new FBLoginRequest();
        fbSignUpRequest.setName("Facebook Login");
        fbSignUpRequest.setEmail("fb_signin@grafeo.pro");
        fbSignUpRequest.setUserId("123456");

        long before = userRepository.count();

        mockMvc.perform(post(API_AUTH_PREFIX + "/fb/login")
                .content(json(fbSignUpRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType));


        long after = userRepository.count();
        assertEquals(before, after);

        Optional<User> signupUser = userRepository.findByUsername("fb_signin@grafeo.pro");
        assertTrue(signupUser.isPresent());
        assertEquals("Facebook Login", signupUser.get().getName());
        assertEquals("fb_signin@grafeo.pro", signupUser.get().getEmail());
        assertEquals("123456", signupUser.get().getFacebookUserId());
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