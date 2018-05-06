package ru.valaz.progressio.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import ru.valaz.progressio.Application;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.LoginRequest;
import ru.valaz.progressio.payload.ProfileRequest;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class UserControllerTest extends AbstractControllerTest {

    @Test
    public void updateCurrentUser() throws Exception {
        userService.createUser("James Bons", "agent007",
                "agent@007.com", "123456");
        assertTrue(!userRepository.findAll().isEmpty());
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("agent007");
        loginRequest.setPassword("123456");

        String response = mockMvc.perform(post("/auth/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andReturn().getResponse().getContentAsString();
        System.out.println(response);

        mockMvc.perform(get("/user/me"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType));


        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.setName("James");
        profileRequest.setUsername("agent007");
        profileRequest.setEmail("agent@007.ln");
        profileRequest.setPassword("");

        mockMvc.perform(post("/user/me")
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

        mockMvc.perform(post("/auth/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        mockMvc.perform(get("/user/me")
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

        mockMvc.perform(post("/auth/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        mockMvc.perform(get("/users/profile")
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

        mockMvc.perform(get("/user/checkUsernameAvailability")
                .param("username", "usernameAvailability")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get("/user/checkUsernameAvailability")
                .param("username", " usernameAvailability  ")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get("/user/checkUsernameAvailability")
                .param("username", "USERNameAVAILABILITY")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));
    }

    @Test
    public void checkEmailAvailability() throws Exception {
        userService.createUser("Email check", "emailAvailability", "emailAvailability@test.com", "123456");

        mockMvc.perform(get("/user/checkEmailAvailability")
                .param("email", "emailAvailability@test.com")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get("/user/checkEmailAvailability")
                .param("email", " emailAvailability@test.com ")
                .contentType(contentType))
                .andExpect(content().contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("available").value("false"));

        mockMvc.perform(get("/user/checkEmailAvailability")
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