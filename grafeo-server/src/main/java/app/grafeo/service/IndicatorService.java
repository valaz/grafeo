package app.grafeo.service;

import app.grafeo.exeption.BadRequestException;
import app.grafeo.exeption.ResourceNotFoundException;
import app.grafeo.repository.IndicatorRepository;
import app.grafeo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import app.grafeo.model.Indicator;
import app.grafeo.model.User;
import app.grafeo.payload.IndicatorRequest;
import app.grafeo.payload.IndicatorResponse;
import app.grafeo.payload.PagedResponse;
import app.grafeo.util.AppConstants;
import app.grafeo.util.ModelMapper;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;

@Service
public class IndicatorService {

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private UserRepository userRepository;

    public PagedResponse<IndicatorResponse> getIndicatorsCreatedBy(Long userId, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Retrieve all indicators created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Indicator> indicators = indicatorRepository.findByCreatedByOrderByName(user.getId(), pageable);

        if (indicators.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), indicators.getNumber(),
                    indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
        }

        List<IndicatorResponse> indicatorResponses = indicators.map(indicator ->
                ModelMapper.mapIndicatorToIndicatorResponse(indicator, user)).getContent();

        return new PagedResponse<>(indicatorResponses, indicators.getNumber(),
                indicators.getSize(), indicators.getTotalElements(), indicators.getTotalPages(), indicators.isLast());
    }

    public Indicator createIndicator(IndicatorRequest indicatorRequest) {
        Indicator indicator = new Indicator();
        indicator.setName(indicatorRequest.getName());
        indicator.setUnit(indicatorRequest.getUnit());

        return indicatorRepository.save(indicator);
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public Indicator updateIndicator(Indicator indicator, @Valid IndicatorRequest indicatorRequest) {
        indicator.setName(indicatorRequest.getName());
        indicator.setUnit(indicatorRequest.getUnit());
        return indicatorRepository.save(indicator);

    }

    public Indicator updateIndicator(Indicator indicator, Indicator rawIndicator) {
        indicator.setName(rawIndicator.getName());
        indicator.setUnit(rawIndicator.getUnit());
        indicator.clearRecords();
        indicator.addRecords(rawIndicator.getRecords());
        return indicatorRepository.save(indicator);
    }
}
