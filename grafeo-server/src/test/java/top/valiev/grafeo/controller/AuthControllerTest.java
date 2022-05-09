package top.valiev.grafeo.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import top.valiev.grafeo.Application;
import top.valiev.grafeo.model.User;
import top.valiev.grafeo.payload.FBLoginRequest;
import top.valiev.grafeo.payload.LoginRequest;
import top.valiev.grafeo.payload.SignUpRequest;
import top.valiev.grafeo.service.FacebookService;

import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class AuthControllerTest extends AbstractControllerTest {

    static final String API_AUTH_PREFIX = "/api/auth";

    @MockBean
    FacebookService facebookService;

    @Autowired
    ApplicationContext context;

    @BeforeEach
    public void setup() {
        doReturn(true).when(facebookService).isValidUserToken(anyString(), anyString());
        doReturn("Facebook Signup").when(facebookService).getUserFullName(anyString());
        doCallRealMethod().when(facebookService).getUserEmail(anyString());
    }

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
        fbSignUpRequest.setUserId("12345");
        fbSignUpRequest.setToken("sometoken");

        mockMvc.perform(post(API_AUTH_PREFIX + "/fb/login")
                .content(json(fbSignUpRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        Optional<User> signupUser = userRepository.findByUsername("12345@fb.com");
        assertTrue(signupUser.isPresent());
        assertEquals("Facebook Signup", signupUser.get().getName());
        assertEquals("12345@fb.com", signupUser.get().getEmail());
        assertEquals("12345", signupUser.get().getFacebookUserId());
    }

    @Test
    public void fbInvalidSignupTest() throws Exception {
        FBLoginRequest fbSignUpRequest = new FBLoginRequest();
        fbSignUpRequest.setUserId("123789");
        fbSignUpRequest.setToken("sometoken");

        doReturn(false).when(facebookService).isValidUserToken(anyString(), anyString());

        mockMvc.perform(post(API_AUTH_PREFIX + "/fb/login")
                .content(json(fbSignUpRequest))
                .contentType(contentType))
                .andExpect(status().isBadRequest());

        Optional<User> signupUser = userRepository.findByUsername("fb_incorrect@grafeo.pro");
        assertFalse(signupUser.isPresent());
    }

    @Test
    public void fbLoginTest() throws Exception {
        User facebook_login = userService.createUser("Facebook Login", "fb_signin@grafeo.pro",
                "fb_signin@grafeo.pro", "123456");
        facebook_login.setFacebookUserId("123456");
        userRepository.save(facebook_login);

        FBLoginRequest fbSignUpRequest = new FBLoginRequest();
        fbSignUpRequest.setUserId("123456");
        fbSignUpRequest.setToken("sometoken");

        long before = userRepository.count();

        mockMvc.perform(post(API_AUTH_PREFIX + "/fb/login")
                .content(json(fbSignUpRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType));


        long after = userRepository.count();
        assertEquals(before, after);

        Optional<User> signupUser = userRepository.findByFacebookUserId("123456");
        assertTrue(signupUser.isPresent());
        assertEquals("Facebook Login", signupUser.get().getName());
        assertEquals("123456@fb.com", signupUser.get().getEmail());
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