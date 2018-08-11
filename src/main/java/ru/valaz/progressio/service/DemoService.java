package ru.valaz.progressio.service;

import com.google.common.base.Preconditions;
import com.google.common.base.Stopwatch;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
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
import org.springframework.lang.NonNull;
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
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class DemoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DemoService.class);

    private static final String START_STRING_DATE = "2017-01-01";
    private static final String TIME_SERIES_DAILY = "Time Series (Daily)";
    private static final String CLOSE = "4. close";
    private static final String BPI = "bpi";
    private static final String BITCOIN_HTTP_URL = "https://api.coindesk.com/v1/bpi/historical/close.json?start=%s&end=%s";
    private static final String DEMO_USER = "Demo User";
    private static final String DEMO_USERNAME_PREFIX = "demo_%s";
    private static final String DEMO_EMAIL_POSTFIX = "%s@grafeo.me";
    private static final String STOCKS_HTTP_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=%s&outputsize=full&apikey=%s";

    private LoadingCache<String, Map<LocalDate, Double>> stocks = CacheBuilder.newBuilder()
            .expireAfterWrite(12, TimeUnit.HOURS)
            .build(
                    new CacheLoader<String, Map<LocalDate, Double>>() {
                        public Map<LocalDate, Double> load(@NonNull String stockName) {
                            return loadStockData(stockName);
                        }
                    });

    private LoadingCache<String, Map<LocalDate, Double>> cryptos = CacheBuilder.newBuilder()
            .expireAfterWrite(12, TimeUnit.HOURS)
            .build(
                    new CacheLoader<String, Map<LocalDate, Double>>() {
                        public Map<LocalDate, Double> load(@NonNull String stockName) {
                            return loadCryptoData(stockName);
                        }
                    });

    private final UserRepository userRepository;

    private final IndicatorRepository indicatorRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private OkHttpClient okHttpClient = new OkHttpClient();

    private RandomStringGenerator generator = new RandomStringGenerator.Builder()
            .withinRange('a', 'z').build();


    @Value("${demoSessionDurationMinutes:60}")
    private long demoSessionDurationMinutes;

    @Value("${alpha_api_key}")
    private String apiKey;

    @Autowired
    public DemoService(UserRepository userRepository, IndicatorRepository indicatorRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.indicatorRepository = indicatorRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User generateDemoUser() {
        Stopwatch stopwatch = Stopwatch.createStarted();

        String generatedUsername = generator.generate(10);
        String username = String.format(DEMO_USERNAME_PREFIX, generatedUsername);
        String email = String.format(DEMO_EMAIL_POSTFIX, username);
        String generatedPassword = generator.generate(20);

        User savedUser = createDemoUser(DEMO_USER, username, email, generatedPassword);

        List<Indicator> demoIndicators = getDemoIndicators(savedUser);
        for (Indicator demoIndicator : demoIndicators) {
            demoIndicator.setCreatedBy(savedUser.getId());
            demoIndicator.setUpdatedBy(savedUser.getId());
            indicatorRepository.save(demoIndicator);
        }

        stopwatch.stop();
        long elapsed = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOGGER.info("Added demo user with id={}, username: {}; elapsed time: {} ms", savedUser.getId(), savedUser.getUsername(), elapsed);
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

    private List<Indicator> getDemoIndicators(User demoUser) {

        ExecutorService executorService = Executors.newFixedThreadPool(4);
        List<Indicator> demoIndicators = new ArrayList<>();
        executorService.execute(() -> demoIndicators.add(fillCryptoDemoIndicator(createDemoIndicator(demoUser, "Bitcoin price", "USD"), "BTC")));
        executorService.execute(() -> demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Apple stocks", "USD"), "AAPL")));
        executorService.execute(() -> demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Google stocks", "USD"), "GOOG")));
        executorService.execute(() -> demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Facebook stocks", "USD"), "FB")));
        executorService.execute(() -> demoIndicators.add(fillStockDemoIndicator(createDemoIndicator(demoUser, "Amazon stocks", "USD"), "AMZN")));

        executorService.shutdown();
        try {
            executorService.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
        } catch (InterruptedException e) {
            LOGGER.error("Error while awaiting executor finish:", e);
            Thread.currentThread().interrupt();
        }
        return demoIndicators;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator createDemoIndicator(User demoUser, String name, String unit) {
        Indicator indicator = new Indicator();
        indicator.setName(name);
        indicator.setUnit(unit);
        indicator.setCreatedBy(demoUser.getId());
        indicator.setUpdatedBy(demoUser.getId());
        return indicatorRepository.save(indicator);
    }

    private Indicator fillCryptoDemoIndicator(Indicator cryptoIndicator, String cryptoName) {
        try {
            cryptos.get(cryptoName).forEach((date, value) -> cryptoIndicator.addRecord(new Record(value, date)));
        } catch (ExecutionException e) {
            LOGGER.error("Error while filling crypto demo indicator:", e);
        }

        return indicatorRepository.save(cryptoIndicator);
    }

    private Indicator fillStockDemoIndicator(Indicator stockIndicator, String stockName) {
        try {
            stocks.get(stockName).forEach((date, value) -> stockIndicator.addRecord(new Record(value, date)));
        } catch (ExecutionException e) {
            LOGGER.error("Error while filling stock demo indicator:", e);
        }

        return indicatorRepository.save(stockIndicator);
    }

    private Map<LocalDate, Double> loadCryptoData(String cryptoName) {
        Preconditions.checkArgument("BTC".equals(cryptoName));
        Stopwatch stopwatch = Stopwatch.createStarted();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String url = String.format(BITCOIN_HTTP_URL, START_STRING_DATE, today);
        Request request = new Request.Builder()
                .url(url)
                .build();
        String jsonData = "";
        try {
            Response response = okHttpClient.newCall(request).execute();
            if (response.body() != null) {
                jsonData = response.body().string();
            }
        } catch (IOException e) {
            LOGGER.error("Error during bitcoin price request:", e);
        }
        Map<LocalDate, Double> values = new HashMap<>();
        if (StringUtils.isNotBlank(jsonData)) {
            JSONObject data = new JSONObject(jsonData);
            JSONObject prices = data.getJSONObject(BPI);
            JSONArray pricesArray = prices.names();
            for (Object key : pricesArray) {
                String stringDate = String.valueOf(key);
                LocalDate date = LocalDate.parse(stringDate, DateTimeFormatter.ISO_LOCAL_DATE);
                Object value = prices.get(stringDate);
                Double doubleValue = Double.valueOf(String.valueOf(value));

                values.put(date, doubleValue);
            }
        }
        stopwatch.stop();
        long elapsed = stopwatch.elapsed(TimeUnit.MILLISECONDS);
        LOGGER.info("Received crypto data for {}, elapsed time: {} ms", "BTC", elapsed);
        return values;
    }

    private Map<LocalDate, Double> loadStockData(String stockName) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        String url = String.format(STOCKS_HTTP_URL, stockName, apiKey);
        Request request = new Request.Builder()
                .url(url)
                .build();
        String jsonData = "";
        try {
            Response response = okHttpClient.newCall(request).execute();
            if (response.body() != null) {
                jsonData = response.body().string();
            }

        } catch (RuntimeException | IOException e) {
            LOGGER.error("Error during stock ({}) data request:", stockName, e);
        }
        if (StringUtils.isNotBlank(jsonData)) {
            Map<LocalDate, Double> data = new HashMap<>();
            JSONObject stockData = new JSONObject(jsonData);
            JSONObject prices = stockData.getJSONObject(TIME_SERIES_DAILY);
            JSONArray pricesArray = prices.names();
            for (Object key : pricesArray) {
                String stringDate = String.valueOf(key);
                if (StringUtils.compare(stringDate, START_STRING_DATE) < 0) {
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
