package ru.valaz.grafeo.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.IndicatorRequest;
import ru.valaz.grafeo.payload.IndicatorResponse;
import ru.valaz.grafeo.repository.IndicatorRepository;
import ru.valaz.grafeo.repository.RoleRepository;
import ru.valaz.grafeo.repository.UserRepository;
import ru.valaz.grafeo.service.FileService;
import ru.valaz.grafeo.service.UserService;
import ru.valaz.grafeo.service.json.IndicatorResponseDeserializer;

import java.io.IOException;
import java.nio.charset.Charset;
import java.time.LocalDate;
import java.util.Arrays;

import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

public abstract class AbstractControllerTest {

    static final String API_INDICATOR_PREFIX = "/api/indicators";

    MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8"));

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

    @Before
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
