package top.valiev.grafeo.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import top.valiev.grafeo.Application;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class CommonControllerTest extends AbstractControllerTest {

    private static final String API_COMMON_PREFIX = "/api/common";

    @Test
    public void getGaUid() throws Exception {
        mockMvc.perform(get(API_COMMON_PREFIX + "/ga")
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("uid").value("TEST_UID"));
    }
}