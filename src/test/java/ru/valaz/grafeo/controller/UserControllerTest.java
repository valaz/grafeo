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
import ru.valaz.grafeo.payload.ProfileRequest;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static ru.valaz.grafeo.controller.AuthControllerTest.API_AUTH_PREFIX;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class UserControllerTest extends AbstractControllerTest {

    private static final String API_USERS_PREFIX = "/api/users";

    @Test
    public void updateCurrentUser() throws Exception {
        userService.createUser("James Bons", "agent007",
                "agent@007.com", "123456");
        assertTrue(!userRepository.findAll().isEmpty());
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("agent007");
        loginRequest.setPassword("123456");

        String response = mockMvc.perform(post(API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andReturn().getResponse().getContentAsString();
        System.out.println(response);

        mockMvc.perform(get(API_USERS_PREFIX + "/me"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType));


        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.setName("James");
        profileRequest.setUsername("agent007");
        profileRequest.setEmail("agent@007.ln");
        profileRequest.setPassword("");

        mockMvc.perform(post(API_USERS_PREFIX + "/me")
                .content(json(profileRequest))
                .contentType(contentType))
                .andExpect(status().isCreated());
        Optional<User> agent007 = userRepository.findByUsername("agent007");

        assertTrue(agent007.isPresent());
        assertEquals("agent@007.ln", agent007.get().getEmail());
    }

    @Test
    public void getCurrentUser() throws Exception {
        userService.createUser("Current User", "currentuser", "currentuser@test.com", "123456");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("currentuser");
        loginRequest.setPassword("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        mockMvc.perform(get(API_USERS_PREFIX + "/me")
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name").value("Current User"))
                .andExpect(jsonPath("username").value("currentuser"))
                .andExpect(jsonPath("email").value("currentuser@test.com"));

    }

    @Test
    public void getUserProfile() throws Exception {
        userService.createUser("User Profile", "userprofile", "userprofile@test.com", "123456");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("userprofile");
        loginRequest.setPassword("123456");

        mockMvc.perform(post(API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        mockMvc.perform(get(API_USERS_PREFIX + "/profile")
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name").value("User Profile"))
                .andExpect(jsonPath("username").value("userprofile"))
                .andExpect(jsonPath("email").value("userprofile@test.com"))
                .andExpect(jsonPath("indicatorCount").value("0"))
                .andExpect(jsonPath("recordCount").value("0"));

    }

    @Test
    public void checkUsernameAvailability() throws Exception {
        userService.createUser("Username check", "usernameAvailability", "usernameAvailability@test.com", "123456");

        mockMvc.perform(get(API_USERS_PREFIX + "/checkUsernameAvailability")
                .param("username", "usernameAvailability")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get(API_USERS_PREFIX + "/checkUsernameAvailability")
                .param("username", " usernameAvailability  ")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get(API_USERS_PREFIX + "/checkUsernameAvailability")
                .param("username", "USERNameAVAILABILITY")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));
    }

    @Test
    public void checkEmailAvailability() throws Exception {
        userService.createUser("Email check", "emailAvailability", "emailAvailability@test.com", "123456");

        mockMvc.perform(get(API_USERS_PREFIX + "/checkEmailAvailability")
                .param("email", "emailAvailability@test.com")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get(API_USERS_PREFIX + "/checkEmailAvailability")
                .param("email", " emailAvailability@test.com ")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get(API_USERS_PREFIX + "/checkEmailAvailability")
                .param("email", "EMAILAvailability@test.com")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));
    }

    @Test
    public void getIndicatorsCreatedBy() {
    }
}