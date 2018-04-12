package ru.valaz.progressio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.valaz.progressio.exeption.BadRequestException;
import ru.valaz.progressio.exeption.ResourceNotFoundException;
import ru.valaz.progressio.model.Indicator;
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
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class IndicatorService {


    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private UserRepository userRepository;

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

    Map<Long, User> getIndicatorCreatorMap(List<Indicator> indicators) {
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
}
