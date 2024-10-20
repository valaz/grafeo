package app.grafeo.controller;

import com.google.common.collect.Lists;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MvcResult;
import app.grafeo.Application;
import app.grafeo.model.Indicator;
import app.grafeo.model.Record;
import app.grafeo.model.User;
import app.grafeo.payload.IndicatorRequest;
import app.grafeo.payload.IndicatorResponse;
import app.grafeo.payload.LoginRequest;
import app.grafeo.payload.RecordRequest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@TestPropertySource(properties = {
        "environment=test",
})
public class IndicatorControllerTest extends AbstractControllerTest {

    public static final Logger LOGGER = LoggerFactory.getLogger(IndicatorControllerTest.class);

    private static final String TEST_EMAIL = "indicator_test@grafeo.pro";
    private static final String TEST_PASSWORD = "123456";

    @BeforeEach
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

        mockMvc.perform(post(AuthControllerTest.API_AUTH_PREFIX + "/signin")
                .content(json(loginRequest))
                .contentType(contentType))
                .andExpect(status().isOk());
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
    public void downloadIndicatorById() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());

        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());
        long indicatorId = createIndicatorResponse.getId();

        for (int i = 1; i < 11; i++) {
            RecordRequest recordRequest = new RecordRequest();
            recordRequest.setIndicatorId(indicatorId);
            recordRequest.setDate(LocalDate.now().minusDays(i));
            recordRequest.setValue(100.1 + i);
            mockMvc.perform(post(API_INDICATOR_PREFIX + "/" + indicatorId + "/records")
                    .content(json(recordRequest))
                    .contentType(contentType))
                    .andExpect(status().isOk());
        }

        Optional<Indicator> initialIndicator = indicatorRepository.findById(createIndicatorResponse.getId());
        assertTrue(initialIndicator.isPresent());
        Indicator indicator = initialIndicator.get();

        MvcResult mvcResult = mockMvc.perform(get(API_INDICATOR_PREFIX + "/" + indicatorId + "/download")
                .contentType(MediaType.parseMediaType("application/octet-stream")))
                .andExpect(status().isOk())
                .andReturn();

        byte[] content = mvcResult.getResponse().getContentAsByteArray();

        String rawData = IOUtils.toString(new ByteArrayInputStream(content));
        Indicator fileIndicator = gson.fromJson(rawData, Indicator.class);

        assertEquals(indicator.getName(), fileIndicator.getName());
        assertEquals(indicator.getUnit(), fileIndicator.getUnit());
        assertEquals(indicator.getRecords().size(), fileIndicator.getRecords().size());
        for (int i = 0; i < indicator.getRecords().size(); i++) {
            assertEquals(indicator.getRecords().get(i).getValue(), fileIndicator.getRecords().get(i).getValue());
            assertEquals(indicator.getRecords().get(i).getDate(), fileIndicator.getRecords().get(i).getDate());
        }
    }

    @Test
    public void uploadIndicatorById() throws Exception {
        Optional<User> user = userRepository.findByEmail(TEST_EMAIL);
        assertTrue(user.isPresent());
        IndicatorResponse createIndicatorResponse = submitNewIndicator("Test Name", "TT", user.get());
        long indicatorId = createIndicatorResponse.getId();

        Resource resource = new ClassPathResource("Test.json");
        InputStream resourceInputStream = resource.getInputStream();


        MockMultipartFile jsonFile = new MockMultipartFile("file", "Test.json", "multipart/form-data", resourceInputStream);

        mockMvc.perform(multipart(API_INDICATOR_PREFIX + "/" + indicatorId + "/upload")
                .file(jsonFile))
                .andExpect(status().isOk());

        Optional<Indicator> initialIndicator = indicatorRepository.findById(indicatorId);
        assertTrue(initialIndicator.isPresent());
        Indicator indicator = initialIndicator.get();
        assertEquals("Test", indicator.getName());
        assertEquals("TU", indicator.getUnit());
        assertEquals(2, indicator.getRecords().size());

        ArrayList<Record> records = Lists.newArrayList(indicator.getRecords());
        records.sort(Comparator.comparing(Record::getDate));

        assertEquals(records.get(0).getDate(), LocalDate.of(2019, 3, 30));
        assertEquals(45.0, records.get(0).getValue(), 0);

        assertEquals(records.get(1).getDate(), LocalDate.of(2019, 4, 1));
        assertEquals(123.0, records.get(1).getValue(), 0);
    }
}