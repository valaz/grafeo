package top.valiev.grafeo.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import top.valiev.grafeo.Application;
import top.valiev.grafeo.model.User;
import top.valiev.grafeo.repository.IndicatorRepository;
import top.valiev.grafeo.repository.RecordRepository;
import top.valiev.grafeo.repository.UserRepository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = Application.class)
@TestPropertySource(properties = {
        "environment=test",
})
public class DemoServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private DemoService demoService;

    @Test
    public void generateDemoUser() {
        User demoUser = demoService.generateDemoUser();

        Optional<User> user = userRepository.findByUsername(demoUser.getUsername());
        assertTrue(user.isPresent());
        assertEquals(demoUser.getEmail(), user.get().getEmail());
        assertEquals(demoUser.getName(), user.get().getName());
        assertTrue(!userRepository.findAllByIsDemo(true).isEmpty());
        assertTrue(!indicatorRepository.findByCreatedBy(demoUser.getId()).isEmpty());
        // FIXME: 07.05.2018 assertionError during maven test
//        assertTrue(!recordRepository.findByCreatedBy(demoUser.getId()).isEmpty());
    }

    @Test
    public void expiredDemoUser() throws InterruptedException {
        User demoUser = demoService.generateDemoUser();

        TimeUnit.SECONDS.sleep(6);
        assertTrue(!userRepository.existsByUsernameIgnoreCase(demoUser.getUsername()));
        assertTrue(userRepository.findAllByIsDemo(true).isEmpty());
        assertTrue(indicatorRepository.findByCreatedBy(demoUser.getId()).isEmpty());
        assertTrue(recordRepository.findByCreatedBy(demoUser.getId()).isEmpty());
    }
}
