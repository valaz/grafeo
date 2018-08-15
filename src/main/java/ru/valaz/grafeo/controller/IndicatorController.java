package ru.valaz.grafeo.controller;


import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.valaz.grafeo.exeption.ForbiddenException;
import ru.valaz.grafeo.exeption.ResourceNotFoundException;
import ru.valaz.grafeo.model.Indicator;
import ru.valaz.grafeo.model.Record;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.*;
import ru.valaz.grafeo.repository.IndicatorRepository;
import ru.valaz.grafeo.repository.UserRepository;
import ru.valaz.grafeo.security.CurrentUser;
import ru.valaz.grafeo.security.UserPrincipal;
import ru.valaz.grafeo.service.FileService;
import ru.valaz.grafeo.service.IndicatorService;
import ru.valaz.grafeo.util.AppConstants;
import ru.valaz.grafeo.util.ModelMapper;

import javax.validation.Valid;
import java.io.InputStream;

@RestController
@RequestMapping("/indicators")
public class IndicatorController {

    private static final String YOU_HAVE_NO_ACCESS = "You have no access";
    private static final String INDICATOR = "Indicator";

    private final IndicatorRepository indicatorRepository;

    private final UserRepository userRepository;

    private final IndicatorService indicatorService;

    private final FileService fileService;

    private static final Logger logger = LoggerFactory.getLogger(IndicatorController.class);

    @Autowired
    public IndicatorController(IndicatorRepository indicatorRepository, UserRepository userRepository, IndicatorService indicatorService, FileService fileService) {
        this.indicatorRepository = indicatorRepository;
        this.userRepository = userRepository;
        this.indicatorService = indicatorService;
        this.fileService = fileService;
    }

    @GetMapping
    public PagedResponse<IndicatorResponse> getIndicators(@CurrentUser UserPrincipal currentUser,
                                                          @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                          @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return indicatorService.getAllIndicators(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse createIndicator(@Valid @RequestBody IndicatorRequest indicatorRequest) {
        Indicator indicator = new Indicator();
        indicator.setName(indicatorRequest.getName());
        indicator.setUnit(indicatorRequest.getUnit());

        Indicator result = indicatorRepository.save(indicator);

        // Retrieve indicator creator details
        User creator = userRepository.findById(indicator.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", result.getCreatedBy()));
        return ModelMapper.mapIndicatorToIndicatorResponse(result, creator);
    }

    @PutMapping
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse editIndicator(@CurrentUser UserPrincipal currentUser,
                                           @Valid @RequestBody IndicatorRequest indicatorRequest) {
        Long indicatorId = indicatorRequest.getId();
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }

        indicator = indicatorService.updateIndicator(indicator, indicatorRequest);

        Indicator result = indicatorRepository.save(indicator);

        // Retrieve indicator creator details
        User creator = userRepository.findById(indicator.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", result.getCreatedBy()));
        return ModelMapper.mapIndicatorToIndicatorResponse(result, creator);
    }

    @GetMapping("/{indicatorId}")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse getIndicatorById(@CurrentUser UserPrincipal currentUser,
                                              @PathVariable Long indicatorId) {
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }
        // Retrieve indicator creator details
        User creator = userRepository.findById(indicator.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", indicator.getCreatedBy()));


        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }

    @DeleteMapping("/{indicatorId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse deleteIndicatorById(@CurrentUser UserPrincipal currentUser,
                                           @PathVariable Long indicatorId) {
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }

        indicatorRepository.deleteById(indicator.getId());

        return new ApiResponse(true, "Indicator deleted");
    }

    @GetMapping("/{indicatorId}/download")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> downloadIndicatorById(@CurrentUser UserPrincipal currentUser,
                                                          @PathVariable Long indicatorId) {
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }
        InputStream input = fileService.getIndicatorJson(indicator);

        InputStreamResource resource = new InputStreamResource(input);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    @PostMapping("/{indicatorId}/upload")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse uploadIndicatorById(@CurrentUser UserPrincipal currentUser,
                                                 @PathVariable Long indicatorId,
                                                 @RequestParam("file") MultipartFile file) {
        Indicator indicator = indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }

        final Indicator[] updateIndicator = {indicator};
        fileService.storeFile(file).ifPresent(rawIndicator -> updateIndicator[0] = indicatorService.updateIndicator(indicator, rawIndicator));

        User creator = userRepository.findById(updateIndicator[0].getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", updateIndicator[0].getCreatedBy()));

        return ModelMapper.mapIndicatorToIndicatorResponse(updateIndicator[0], creator);
    }


    @PostMapping("/{indicatorId}/records")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse addRecord(@CurrentUser UserPrincipal currentUser,
                                       @PathVariable Long indicatorId,
                                       @Valid @RequestBody RecordRequest recordRequest) {

        Indicator indicator = indicatorRepository.findById(indicatorId)
                .orElseThrow(() -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (!indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }

        Preconditions.checkNotNull(recordRequest.getValue());
        Preconditions.checkNotNull(recordRequest.getDate());

        Record record = new Record(recordRequest.getValue(), recordRequest.getDate());

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
                .orElseThrow(() -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
        if (!indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
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
