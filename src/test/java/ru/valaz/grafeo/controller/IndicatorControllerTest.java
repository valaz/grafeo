package ru.valaz.grafeo.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MvcResult;
import ru.valaz.grafeo.Application;
import ru.valaz.grafeo.model.Indicator;
import ru.valaz.grafeo.model.Record;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.*;
import ru.valaz.grafeo.service.json.IndicatorResponseDeserializer;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ru.valaz.grafeo.controller.AuthControllerTest.API_AUTH_PREFIX;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class IndicatorControllerTest extends AbstractControllerTest {

    public static final Logger LOGGER = LoggerFactory.getLogger(IndicatorControllerTest.class);


    private static final String API_INDICATOR_PREFIX = "/api/indicators";
    private static final String TEST_EMAIL = "indicator_test@grafeo.pro";
    private static final String TEST_PASSWORD = "123456";

    private GsonBuilder gsonBuilder = new GsonBuilder().registerTypeAdapter(IndicatorResponse.class, new IndicatorResponseDeserializer());
    private Gson gson = gsonBuilder.create();

    @Before
    public void signin() throws Exception {
        if (!userRepository.findByEmail(TEST_EMAIL).isPresent()) {
            userService.createUser(TEST_EMAIL, TEST_EMAIL, TEST_EMAIL, TEST_PASSWORD);
        }

        loginUser(TEST_EMAIL);
    }

    private void loginUser(String testEmail) throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(testEmail);
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());
    }


    private IndicatorResponse submitNewIndicator(String testName, String testUnit, User user) throws Exception {
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

    @Test
    public void getIndicators() throws Exception {
        String anotherUserEmail = "MAIN_" + TEST_EMAIL;
        User user = userService.createUser(anotherUserEmail, anotherUserEmail, anotherUserEmail, TEST_PASSWORD);

        loginUser(anotherUserEmail);
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user);
        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());
        long indicatorId = initialIndicator.get().getId();

        MvcResult mvcResult = mockMvc.perform(get(API_INDICATOR_PREFIX)
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();


        String jsonResponse = mvcResult.getResponse().getContentAsString();
        PagedResponse pagedResponse = gson.fromJson(jsonResponse, PagedResponse.class);

        assertNotNull(pagedResponse);
        List content = pagedResponse.getContent();

        assertEquals(1, content.size());
        Map<String, Object> indicatorResponse = (Map<String, Object>) content.get(0);

        assertEquals(indicatorId, ((Double) indicatorResponse.get("id")).longValue(), 0);
        assertEquals(initialIndicator.get().getName(), indicatorResponse.get("name"));
        assertEquals(initialIndicator.get().getUnit(), indicatorResponse.get("unit"));
    }

    @Test
    public void createIndicator() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse indicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> indicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(indicator.isPresent());
        assertEquals("Test Name", indicator.get().getName());
        assertEquals("TT", indicator.get().getUnit());
    }

    @Test
    public void getIndicatorById() throws Exception {

        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());

        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());
        long indicatorId = initialIndicator.get().getId();

        MvcResult mvcResult = mockMvc.perform(get(API_INDICATOR_PREFIX + "/" + indicatorId)
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        IndicatorResponse indicatorResponse = gson.fromJson(jsonResponse, IndicatorResponse.class);

        assertEquals(indicatorId, indicatorResponse.getId(), 0);
        assertEquals(initialIndicator.get().getName(), indicatorResponse.getName());
        assertEquals(initialIndicator.get().getUnit(), indicatorResponse.getUnit());
        assertEquals(initialIndicator.get().getRecords().size(), indicatorResponse.getRecords().size());
    }

    @Test
    public void editIndicator() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());

        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());
        long indicatorId = initialIndicator.get().getId();

        IndicatorRequest editIndicatorRequest = new IndicatorRequest();
        editIndicatorRequest.setId(indicatorId);
        editIndicatorRequest.setName("New Test Name");
        editIndicatorRequest.setUnit("NN");

        MvcResult mvcResult = mockMvc.perform(put(API_INDICATOR_PREFIX)
                .content(json(editIndicatorRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name").value("New Test Name"))
                .andExpect(jsonPath("unit").value("NN"))
                .andReturn();

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        IndicatorResponse indicatorResponse = gson.fromJson(jsonResponse, IndicatorResponse.class);

        Optional<Indicator> indicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(indicator.isPresent());
        assertEquals("New Test Name", indicator.get().getName());
        assertEquals("NN", indicator.get().getUnit());


        Instant updateTimeBeforeEdit = initialIndicator.get().getUpdatedAt();
        Instant createTimeBeforeEdit = initialIndicator.get().getCreatedAt();
        Instant updateTimeAfterEdit = indicator.get().getUpdatedAt();
        Instant createTimeAfterEdit = indicator.get().getCreatedAt();

        assertNotEquals(updateTimeBeforeEdit, updateTimeAfterEdit);
        assertEquals(createTimeBeforeEdit, createTimeAfterEdit);
    }

    @Test
    public void deleteIndicatorById() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());

        long indicatorId = initialIndicator.get().getId();

        IndicatorRequest deleteIndicatorRequest = new IndicatorRequest();
        deleteIndicatorRequest.setId(initialIndicator.get().getId());
        deleteIndicatorRequest.setName("New Test Name");
        deleteIndicatorRequest.setUnit("NN");

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + indicatorId)
                .contentType(contentType))
                .andExpect(status().isOk());

        Optional<Indicator> indicator = indicatorRepository.findById(initialIndicator.get().getId());
        assertFalse(indicator.isPresent());
    }

    @Test
    public void updateRecord() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());

        long indicatorId = initialIndicator.get().getId();

        RecordRequest recordRequest = new RecordRequest();
        recordRequest.setIndicatorId(indicatorId);
        recordRequest.setDate(LocalDate.now().minusDays(7));
        recordRequest.setValue(100.1);

        MvcResult mvcResult = mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        LOGGER.info(mvcResult.getResponse().getContentAsString());

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        IndicatorResponse indicatorResponse = gson.fromJson(jsonResponse, IndicatorResponse.class);

        Optional<Indicator> indicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(indicator.isPresent());

        assertEquals(1, indicator.get().getRecords().size());
        Record addedRecord = indicator.get().getRecords().get(0);
        assertEquals(100.1, addedRecord.getValue(), 0.0d);

        recordRequest.setValue(200.2);
        mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isOk());

        Optional<Indicator> currentIndicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(currentIndicator.isPresent());

        assertEquals(1, currentIndicator.get().getRecords().size());
        Record updatedRecord = currentIndicator.get().getRecords().get(0);
        assertEquals(200.2, updatedRecord.getValue(), 0.0d);

    }

    public void addRecord() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());

        long indicatorId = initialIndicator.get().getId();

        RecordRequest recordRequest = new RecordRequest();
        recordRequest.setIndicatorId(indicatorId);
        recordRequest.setDate(LocalDate.now().minusDays(7));
        recordRequest.setValue(100.1);

        MvcResult mvcResult = mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        LOGGER.info(mvcResult.getResponse().getContentAsString());

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        IndicatorResponse indicatorResponse = gson.fromJson(jsonResponse, IndicatorResponse.class);

        Optional<Indicator> indicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(indicator.isPresent());

        assertEquals(1, indicator.get().getRecords().size());
    }

    @Test
    public void deleteRecord() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());

        IndicatorRequest createIndicatorRequest = new IndicatorRequest();
        createIndicatorRequest.setId(user.get().getId());
        createIndicatorRequest.setName("Test Name");
        createIndicatorRequest.setUnit("TT");

        MvcResult createMvcResult = mockMvc.perform(post(API_INDICATOR_PREFIX)
                .content(json(createIndicatorRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        LOGGER.info(createMvcResult.getResponse().getContentAsString());

        String createJsonResponse = createMvcResult.getResponse().getContentAsString();
        IndicatorResponse createIndicatorResponse = gson.fromJson(createJsonResponse, IndicatorResponse.class);

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());

        long indicatorId = initialIndicator.get().getId();

        RecordRequest recordRequest = new RecordRequest();
        recordRequest.setIndicatorId(indicatorId);
        recordRequest.setDate(LocalDate.now().minusDays(7));
        recordRequest.setValue(100.1);

        MvcResult mvcResult = mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        LOGGER.info(mvcResult.getResponse().getContentAsString());

        String jsonResponse = mvcResult.getResponse().getContentAsString();
        IndicatorResponse indicatorResponse = gson.fromJson(jsonResponse, IndicatorResponse.class);

        Optional<Indicator> indicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(indicator.isPresent());

        assertEquals(1, indicator.get().getRecords().size());

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isOk())
                .andReturn();

        Optional<Indicator> currentIndicator = indicatorRepository.findById(indicatorResponse.getId());
        assertTrue(currentIndicator.isPresent());

        assertTrue(currentIndicator.get().getRecords().isEmpty());
    }

    @Test
    public void unauthorisedAccess() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());
        Long initialIndicatorId = createIndicatorResponse.getId();

        String anotherUserEmail = "ANOTHER_" + TEST_EMAIL;
        userService.createUser(anotherUserEmail, anotherUserEmail, anotherUserEmail, TEST_PASSWORD);

        loginUser(anotherUserEmail);

        mockMvc.perform(get(API_INDICATOR_PREFIX + "/" + initialIndicatorId)
                .contentType(contentType))
                .andExpect(status().isForbidden());


        IndicatorRequest editIndicatorRequest = new IndicatorRequest();
        editIndicatorRequest.setId(initialIndicatorId);
        editIndicatorRequest.setName("New Test Name");
        editIndicatorRequest.setUnit("NN");

        mockMvc.perform(put(API_INDICATOR_PREFIX)
                .content(json(editIndicatorRequest))
                .contentType(contentType))
                .andExpect(status().isForbidden());


        IndicatorRequest deleteIndicatorRequest = new IndicatorRequest();
        deleteIndicatorRequest.setId(initialIndicatorId);
        deleteIndicatorRequest.setName("New Test Name");
        deleteIndicatorRequest.setUnit("NN");

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + initialIndicatorId)
                .contentType(contentType))
                .andExpect(status().isForbidden());

        RecordRequest recordRequest = new RecordRequest();
        recordRequest.setIndicatorId(initialIndicatorId);
        recordRequest.setDate(LocalDate.now().minusDays(7));
        recordRequest.setValue(100.1);

        mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + initialIndicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + initialIndicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isForbidden());

    }

    @Test
    public void incorrectData() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());

        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());
        long indicatorId = initialIndicator.get().getId();

        long incorrectIndicatorId = indicatorId * 100;
        mockMvc.perform(get(API_INDICATOR_PREFIX + "/" + incorrectIndicatorId)
                .contentType(contentType))
                .andExpect(status().isNotFound());

        IndicatorRequest editIndicatorRequest = new IndicatorRequest();
        editIndicatorRequest.setId(incorrectIndicatorId);
        editIndicatorRequest.setName("New Test Name");
        editIndicatorRequest.setUnit("NN");

        mockMvc.perform(put(API_INDICATOR_PREFIX)
                .content(json(editIndicatorRequest))
                .contentType(contentType))
                .andExpect(status().isNotFound());

        IndicatorRequest deleteIndicatorRequest = new IndicatorRequest();
        deleteIndicatorRequest.setId(incorrectIndicatorId);
        deleteIndicatorRequest.setName("New Test Name");
        deleteIndicatorRequest.setUnit("NN");

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + incorrectIndicatorId)
                .contentType(contentType))
                .andExpect(status().isNotFound());

        RecordRequest recordRequest = new RecordRequest();
        recordRequest.setIndicatorId(incorrectIndicatorId);
        recordRequest.setDate(LocalDate.now().minusDays(7));
        recordRequest.setValue(100.1);

        mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + incorrectIndicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete(API_INDICATOR_PREFIX + "/" + incorrectIndicatorId + "/records")
                .content(json(recordRequest))
                .contentType(contentType))
                .andExpect(status().isNotFound());

    }

    @Test
    public void downloadIndicatorById() {
    }

    @Test
    public void uploadIndicatorById() {
    }
}