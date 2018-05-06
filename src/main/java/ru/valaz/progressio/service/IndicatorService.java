package ru.valaz.progressio.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.valaz.progressio.exeption.BadRequestException;
import ru.valaz.progressio.exeption.ResourceNotFoundException;
import ru.valaz.progressio.model.Indicator;
import ru.valaz.progressio.model.Record;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.IndicatorRequest;
import ru.valaz.progressio.payload.IndicatorResponse;
import ru.valaz.progressio.payload.PagedResponse;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RecordRepository;
import ru.valaz.progressio.repository.UserRepository;
import ru.valaz.progressio.security.UserPrincipal;
import ru.valaz.progressio.util.AppConstants;
import ru.valaz.progressio.util.ModelMapper;

import javax.validation.Valid;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class IndicatorService {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndicatorService.class);


    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private UserRepository userRepository;

    OkHttpClient okHttpClient = new OkHttpClient();

    public PagedResponse<IndicatorResponse> getAllIndicators(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Indicators
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Indicator> indicators = indicatorRepository.findByCreatedByOrderByUpdatedAtDesc(currentUser.getId(), pageable);

        if (indicators.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), indicators.getNumber(),
                    indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
        }

        Map<Long, User> creatorMap = getIndicatorCreatorMap(indicators.getContent());

        List<IndicatorResponse> indicatorResponses = indicators.map(indicator ->
                ModelMapper.mapIndicatorToIndicatorResponse(indicator,
                        creatorMap.get(indicator.getCreatedBy()))).getContent();

        return new PagedResponse<>(indicatorResponses, indicators.getNumber(),
                indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
    }

    public PagedResponse<IndicatorResponse> getIndicatorsCreatedBy(String username, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all indicators created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Indicator> indicators = indicatorRepository.findByCreatedByOrderByUpdatedAtDesc(user.getId(), pageable);

        if (indicators.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), indicators.getNumber(),
                    indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
        }


        List<IndicatorResponse> indicatorResponses = indicators.map(indicator ->
                ModelMapper.mapIndicatorToIndicatorResponse(indicator, user)).getContent();

        return new PagedResponse<>(indicatorResponses, indicators.getNumber(),
                indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    private Map<Long, User> getIndicatorCreatorMap(List<Indicator> indicators) {
        // Get Indicator Creator details of the given list of indicators
        List<Long> creatorIds = indicators.stream()
                .map(Indicator::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        return creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    public Indicator updateIndicator(Indicator indicator, @Valid IndicatorRequest indicatorRequest) {
        indicator.setName(indicatorRequest.getName());
        indicator.setUnit(indicatorRequest.getUnit());
        return indicatorRepository.save(indicator);

    }

    public List<Indicator> getDemoIndicators(User demoUser) {
        List<Indicator> demoIndicators = new ArrayList<>();

        Indicator demoIndicator1 = createBitcoinDemoIndicator(demoUser);
        demoIndicator1 = fillBitcoinDemoIndicator(demoIndicator1);
        demoIndicators.add(indicatorRepository.findById(demoIndicator1.getId()).get());

        return demoIndicators;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator createBitcoinDemoIndicator(User demoUser) {
        Indicator bitcoinIndicator = new Indicator();
        bitcoinIndicator.setName("Bitcoin price");
        bitcoinIndicator.setUnit("USD");
        bitcoinIndicator.setCreatedBy(demoUser.getId());
        bitcoinIndicator.setUpdatedBy(demoUser.getId());
        return indicatorRepository.save(bitcoinIndicator);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Indicator fillBitcoinDemoIndicator(Indicator bitcoinIndicator) {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String url = "https://api.coindesk.com/v1/bpi/historical/close.json?start=2015-01-01&end=" + today;
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
            JSONObject prices = data.getJSONObject("bpi");
            JSONArray pricesArray = prices.names();
            for (Object key : pricesArray) {
                String stringDate = String.valueOf(key);
                LocalDate date = LocalDate.parse(stringDate, DateTimeFormatter.ISO_LOCAL_DATE);
                Object value = prices.get(stringDate);
                Double doubleValue = Double.valueOf(String.valueOf(value));

                bitcoinIndicator.addRecord(new Record(doubleValue, date));
            }
        }
        return indicatorRepository.save(bitcoinIndicator);
    }

}
