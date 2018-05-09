package ru.valaz.progressio.service;

import com.google.common.base.Stopwatch;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.RandomStringGenerator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.valaz.progressio.exeption.AppException;
import ru.valaz.progressio.model.*;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RoleRepository;
import ru.valaz.progressio.repository.UserRepository;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class DemoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DemoService.class);

    private static final String startStringDate = "2015-01-01";
    public static final String TIME_SERIES_DAILY = "Time Series (Daily)";
    public static final String CLOSE = "4. close";
    public static final String BPI = "bpi";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private OkHttpClient okHttpClient = new OkHttpClient();

    private RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z').build();


    @Value("${demoSessionDurationMinutes:60}")
    private long demoSessionDurationMinutes;

    @Value("${alpha_api_key}")
    private String apiKey;

    public User generateDemoUser() {
        String generatedUsername = generator.generate(10);
        String name = "Demo User";
        String username = "demo_" + generatedUsername;
        String email = username + "@grafeo.me";
        String generatedPassword = generator.generate(20);

        User savedUser = createDemoUser(name, username, email, generatedPassword);

        LOGGER.info("Added demo user with id={}, username: {};", savedUser.getId(), savedUser.getUsername());
        List<Indicator> demoIndicators = getDemoIndicators(savedUser);
        for (Indicator demoIndicator : demoIndicators) {
            demoIndicator.setCreatedBy(savedUser.getId());
            demoIndicator.setUpdatedBy(savedUser.getId());
            indicatorRepository.save(demoIndicator);
        }

        return savedUser;
    }


    @Scheduled(fixedRate = 10000)
    public void removeExpiredDemoUsers() {
        List<User> demoUsers = userRepository.findAllByIsDemo(true);
        for (User demoUser : demoUsers) {
            Instant createdAt = demoUser.getCreatedAt();
            Instant now = Instant.now();
            long duration = Duration.between(createdAt, now).abs().toMinutes();
            if (duration >= demoSessionDurationMinutes) {
                List<Indicator> userDemoIndicators = indicatorRepository.findByCreatedBy(demoUser.getId());
                indicatorRepository.deleteAll(userDemoIndicators);
                userRepository.delete(demoUser);
                LOGGER.info("Removed expired demo user: id={}, username={}", demoUser.getId(), demoUser.getUsername());
            }
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User createDemoUser(String name, String username, String email, String password) {
        User user = new User(name, username,
                email, password);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsDemo(true);

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }

    public List<Indicator> getDemoIndicators(User demoUser) {
        List<Indicator> demoIndicators = new ArrayList<>();

        demoIndicators.add(fillBitcoinDemoIndicator(createDemoIndicator(demoUser, "Bitcoin price", "USD")));
        demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Apple stocks", "USD"), "AAPL"));
        demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Google stocks", "USD"), "GOOG"));
        demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Facebook stocks", "USD"), "FB"));
        demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Amazon stocks", "USD"), "AMZN"));

        return demoIndicators;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator createDemoIndicator(User demoUser, String name, String unit) {
        Indicator bitcoinIndicator = new Indicator();
        bitcoinIndicator.setName(name);
        bitcoinIndicator.setUnit(unit);
        bitcoinIndicator.setCreatedBy(demoUser.getId());
        bitcoinIndicator.setUpdatedBy(demoUser.getId());
        return indicatorRepository.save(bitcoinIndicator);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator fillBitcoinDemoIndicator(Indicator bitcoinIndicator) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String url = "https://api.coindesk.com/v1/bpi/historical/close.json?start=" + startStringDate + "&end=" + today;
        Request request = new Request.Builder()
                .url(url)
                .build();
        String jsonData = "";
        try {
            Response response = okHttpClient.newCall(request).execute();
            jsonData = response.body().string();
        } catch (IOException e) {
            LOGGER.error("Error during bitcoin price request:", e);
        }
        if (StringUtils.isNotBlank(jsonData)) {
            JSONObject data = new JSONObject(jsonData);
            JSONObject prices = data.getJSONObject(BPI);
            JSONArray pricesArray = prices.names();
            for (Object key : pricesArray) {
                String stringDate = String.valueOf(key);
                LocalDate date = LocalDate.parse(stringDate, DateTimeFormatter.ISO_LOCAL_DATE);
                Object value = prices.get(stringDate);
                Double doubleValue = Double.valueOf(String.valueOf(value));

                bitcoinIndicator.addRecord(new Record(doubleValue, date));
            }
        }
        stopwatch.stop();
        long elapsed = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOGGER.info("Received crypto data for {}, elapsed time: {} ms", "BTC", elapsed);
        return indicatorRepository.save(bitcoinIndicator);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator fillStockDemoIndicator(Indicator stockIndicator, String stockName) {
        loadStockData(stockName).forEach((date, value) -> stockIndicator.addRecord(new Record(value, date)));

        return indicatorRepository.save(stockIndicator);
    }

    private Map<LocalDate, Double> loadStockData(String stockName) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + stockName + "&outputsize=full&apikey="+apiKey;
        Request request = new Request.Builder()
                .url(url)
                .build();
        String jsonData = "";
        try {
            Response response = okHttpClient.newCall(request).execute();
            if (response.body() != null) {
                jsonData = response.body().string();
            }

        } catch (RuntimeException e) {
            LOGGER.error("Error during stock ({}) data request:", stockName, e);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (StringUtils.isNotBlank(jsonData)) {
            Map<LocalDate, Double> data = new HashMap<>();
            JSONObject stockData = new JSONObject(jsonData);
            JSONObject prices = stockData.getJSONObject(TIME_SERIES_DAILY);
            JSONArray pricesArray = prices.names();
            for (Object key : pricesArray) {
                String stringDate = String.valueOf(key);
                if (StringUtils.compare(stringDate, startStringDate) < 0) {
                    continue;
                }
                LocalDate date = LocalDate.parse(stringDate, DateTimeFormatter.ISO_LOCAL_DATE);
                Object value = ((JSONObject) prices.get(stringDate)).get(CLOSE);
                Double doubleValue = Double.valueOf(String.valueOf(value));
                data.put(date, doubleValue);
            }
            long elapsed = stopwatch.elapsed(TimeUnit.MILLISECONDS);
            LOGGER.info("Received stock data for {}, elapsed time: {} ms", stockName, elapsed);
            return data;
        }
        stopwatch.stop();
        long elapsed = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOGGER.info("Received stock data for {}, elapsed time: {} ms", stockName, elapsed);
        return Collections.emptyMap();
    }

}
