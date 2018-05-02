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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class UserControllerTest extends AbstractControllerTest {

    @Test
    public void updateCurrentUser() throws Exception {
        createUser("James Bons", "agent007",
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
}