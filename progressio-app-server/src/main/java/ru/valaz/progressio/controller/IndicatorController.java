package ru.valaz.progressio.controller;


import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.valaz.progressio.exeption.ForbiddenException;
import ru.valaz.progressio.exeption.ResourceNotFoundException;
import ru.valaz.progressio.model.Indicator;
import ru.valaz.progressio.model.Record;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.*;
import ru.valaz.progressio.repository.IndicatorRepository;
import ru.valaz.progressio.repository.RecordRepository;
import ru.valaz.progressio.repository.UserRepository;
import ru.valaz.progressio.security.CurrentUser;
import ru.valaz.progressio.security.UserPrincipal;
import ru.valaz.progressio.service.IndicatorService;
import ru.valaz.progressio.util.AppConstants;
import ru.valaz.progressio.util.ModelMapper;

import javax.validation.Valid;
import java.net.URI;
import java.time.Instant;

@RestController
@RequestMapping("/indicators")
public class IndicatorController {

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private IndicatorService indicatorService;

    private static final Logger logger = LoggerFactory.getLogger(IndicatorController.class);

    @GetMapping
    public PagedResponse<IndicatorResponse> getIndicators(@CurrentUser UserPrincipal currentUser,
                                                          @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                          @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return indicatorService.getAllIndicators(currentUser, page, size);
    }


    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createIndicator(@Valid @RequestBody IndicatorRequest indicatorRequest) {
        Indicator indicator = new Indicator();
        indicator.setName(indicatorRequest.getName());

        Instant now = Instant.now();

        Indicator result = indicatorRepository.save(indicator);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{indicatorId}")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Indicator Created Successfully"));
    }

    @GetMapping("/{indicatorId}")
    public IndicatorResponse getIndicatorById(@CurrentUser UserPrincipal currentUser,
                                              @PathVariable Long indicatorId) {
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException("Indicator", "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException("You have no access");
        }
        // Retrieve indicator creator details
        User creator = userRepository.findById(indicator.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", indicator.getCreatedBy()));


        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }


    @PostMapping("/{indicatorId}/records")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse addRecord(@CurrentUser UserPrincipal currentUser,
                                       @PathVariable Long indicatorId,
                                       @Valid @RequestBody RecordRequest recordRequest) {

        Indicator indicator = indicatorRepository.findById(indicatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Indicator", "id", indicatorId));
        if (!indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException("You have no access");
        }

        Preconditions.checkNotNull(recordRequest.getValue());
        Preconditions.checkNotNull(recordRequest.getDate());

        Record record = new Record(recordRequest.getValue(), recordRequest.getDate());
//        record = recordRepository.save(record);

        indicator.addRecord(record);
        indicator = indicatorRepository.save(indicator);

        Long createdBy = indicator.getCreatedBy();
        User creator = userRepository.findById(createdBy)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", createdBy));
        logger.debug("Added record: {} - {} for indicator {}", record.getDate(), record.getValue(), indicator.getId());
        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }

    @DeleteMapping("/{indicatorId}/records")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse deleteRecord(@CurrentUser UserPrincipal currentUser,
                                          @PathVariable Long indicatorId,
                                          @Valid @RequestBody RecordRequest recordRequest) {

        Indicator indicator = indicatorRepository.findById(indicatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Indicator", "id", indicatorId));
        if (!indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException("You have no access");
        }

        Preconditions.checkNotNull(recordRequest.getDate());

        indicator.removeRecord(recordRequest.getDate());
        indicator = indicatorRepository.save(indicator);

        Long createdBy = indicator.getCreatedBy();
        User creator = userRepository.findById(createdBy)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", createdBy));

        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }

}
