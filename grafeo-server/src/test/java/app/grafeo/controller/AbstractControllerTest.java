package app.grafeo.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;
import app.grafeo.model.User;
import app.grafeo.payload.IndicatorRequest;
import app.grafeo.payload.IndicatorResponse;
import app.grafeo.repository.IndicatorRepository;
import app.grafeo.repository.RoleRepository;
import app.grafeo.repository.UserRepository;
import app.grafeo.service.FileService;
import app.grafeo.service.UserService;
import app.grafeo.service.json.IndicatorResponseDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.util.AssertionErrors.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

public abstract class AbstractControllerTest {

    static final String API_INDICATOR_PREFIX = "/api/indicators";

    MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype());

    MockMvc mockMvc;

    private HttpMessageConverter mappingJackson2HttpMessageConverter;

    @Autowired
    protected WebApplicationContext webApplicationContext;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected IndicatorRepository indicatorRepository;

    @Autowired
    protected RoleRepository roleRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected UserService userService;

    private GsonBuilder gsonBuilder = new GsonBuilder().registerTypeAdapter(IndicatorResponse.class, new IndicatorResponseDeserializer())
            .registerTypeAdapter(LocalDate.class, new FileService.LocalDateAdapter());
    Gson gson = gsonBuilder.create();

    @Autowired
    void setConverters(HttpMessageConverter<?>[] converters) {

        this.mappingJackson2HttpMessageConverter = Arrays.asList(converters).stream()
                .filter(hmc -> hmc instanceof MappingJackson2HttpMessageConverter)
                .findAny()
                .orElse(null);

        assertNotNull("the JSON message converter must not be null",
                this.mappingJackson2HttpMessageConverter);
    }

    @BeforeEach
    public void setUp() throws Exception {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    protected String json(Object o) throws IOException {
        MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
        this.mappingJackson2HttpMessageConverter.write(
                o, MediaType.APPLICATION_JSON, mockHttpOutputMessage);
        return mockHttpOutputMessage.getBodyAsString();
    }

    public IndicatorResponse submitNewIndicator(String testName, String testUnit, User user) throws Exception {
        IndicatorRequest indicatorRequest = new IndicatorRequest();
        indicatorRequest.setId(user.getId());
        indicatorRequest.setName(testName);
        indicatorRequest.setUnit(testUnit);

        MvcResult mvcResult = mockMvc.perform(post(API_INDICATOR_PREFIX)
                .content(json(indicatorRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name").value("Test Name"))
                .andExpect(jsonPath("unit").value("TT"))
                .andReturn();

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        return gson.fromJson(jsonResponse, IndicatorResponse.class);
    }
}
