package app.grafeo.controller;


import app.grafeo.repository.IndicatorRepository;
import app.grafeo.repository.UserRepository;
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
import app.grafeo.exeption.ForbiddenException;
import app.grafeo.exeption.ResourceNotFoundException;
import app.grafeo.model.Indicator;
import app.grafeo.model.Record;
import app.grafeo.model.User;
import app.grafeo.payload.ApiResponse;
import app.grafeo.payload.IndicatorRequest;
import app.grafeo.payload.IndicatorResponse;
import app.grafeo.payload.RecordRequest;
import app.grafeo.security.CurrentUser;
import app.grafeo.security.UserPrincipal;
import app.grafeo.service.FileService;
import app.grafeo.service.IndicatorService;
import app.grafeo.util.ModelMapper;

import javax.validation.Valid;
import java.io.InputStream;

@RestController
@RequestMapping("/api/indicators")
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

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse createIndicator(@Valid @RequestBody IndicatorRequest indicatorRequest) {
        Indicator result = indicatorService.createIndicator(indicatorRequest);

        // Retrieve indicator creator details
        User creator = getIndicatorCreator(result.getCreatedBy());
        return ModelMapper.mapIndicatorToIndicatorResponse(result, creator);
    }

    @GetMapping("/{indicatorId}")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse getIndicatorById(@CurrentUser UserPrincipal currentUser,
                                              @PathVariable Long indicatorId) {
        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);
        // Retrieve indicator creator details
        User creator = getIndicatorCreator(indicator.getCreatedBy());


        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }

    @PutMapping
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse editIndicator(@CurrentUser UserPrincipal currentUser,
                                           @Valid @RequestBody IndicatorRequest indicatorRequest) {
        Long indicatorId = indicatorRequest.getId();
        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);

        indicator = indicatorService.updateIndicator(indicator, indicatorRequest);

        Indicator result = indicatorRepository.save(indicator);

        // Retrieve indicator creator details
        User creator = getIndicatorCreator(indicator.getCreatedBy());
        return ModelMapper.mapIndicatorToIndicatorResponse(result, creator);
    }

    @DeleteMapping("/{indicatorId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse deleteIndicatorById(@CurrentUser UserPrincipal currentUser,
                                           @PathVariable Long indicatorId) {
        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);

        indicatorRepository.deleteById(indicator.getId());

        return new ApiResponse(true, "Indicator deleted");
    }

    @GetMapping("/{indicatorId}/download")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> downloadIndicatorById(@CurrentUser UserPrincipal currentUser,
                                                          @PathVariable Long indicatorId) {
        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);
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
        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);

        final Indicator[] updateIndicator = {indicator};
        fileService.storeFile(file).ifPresent(rawIndicator -> updateIndicator[0] = indicatorService.updateIndicator(indicator, rawIndicator));

        User creator = getIndicatorCreator(updateIndicator[0].getCreatedBy());

        return ModelMapper.mapIndicatorToIndicatorResponse(updateIndicator[0], creator);
    }


    @PostMapping("/{indicatorId}/records")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse addRecord(@CurrentUser UserPrincipal currentUser,
                                       @PathVariable Long indicatorId,
                                       @Valid @RequestBody RecordRequest recordRequest) {

        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);

        Preconditions.checkNotNull(recordRequest.getValue());
        Preconditions.checkNotNull(recordRequest.getDate());

        Record record = new Record(recordRequest.getValue(), recordRequest.getDate());

        indicator.addRecord(record);
        indicator = indicatorRepository.save(indicator);

        Long createdBy = indicator.getCreatedBy();
        User creator = getIndicatorCreator(createdBy);
        logger.debug("Added record: {} - {} for indicator {}", record.getDate(), record.getValue(), indicator.getId());
        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }

    @DeleteMapping("/{indicatorId}/records")
    @PreAuthorize("hasRole('USER')")
    public IndicatorResponse deleteRecord(@CurrentUser UserPrincipal currentUser,
                                          @PathVariable Long indicatorId,
                                          @Valid @RequestBody RecordRequest recordRequest) {

        Indicator indicator = findIndicator(indicatorId);
        checkUserAccessForIndicator(currentUser, indicator);

        Preconditions.checkNotNull(recordRequest.getDate());

        indicator.removeRecord(recordRequest.getDate());
        indicator = indicatorRepository.save(indicator);

        Long createdBy = indicator.getCreatedBy();
        User creator = getIndicatorCreator(createdBy);

        return ModelMapper.mapIndicatorToIndicatorResponse(indicator, creator);
    }


    private Indicator findIndicator(@PathVariable Long indicatorId) {
        return indicatorRepository.findById(indicatorId).orElseThrow(
                () -> new ResourceNotFoundException(INDICATOR, "id", indicatorId));
    }

    private void checkUserAccessForIndicator(@CurrentUser UserPrincipal currentUser, Indicator indicator) {
        if (currentUser == null || !indicator.getCreatedBy().equals(currentUser.getId())) {
            throw new ForbiddenException(YOU_HAVE_NO_ACCESS);
        }
    }

    private User getIndicatorCreator(Long createdBy) {
        return userRepository.findById(createdBy)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", createdBy));
    }
}
