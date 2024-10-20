package app.grafeo.controller;

import app.grafeo.payload.*;
import app.grafeo.repository.IndicatorRepository;
import app.grafeo.repository.RecordRepository;
import app.grafeo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import app.grafeo.exeption.ResourceNotFoundException;
import app.grafeo.model.User;
import top.valiev.grafeo.payload.*;
import app.grafeo.security.CurrentUser;
import app.grafeo.security.JwtTokenProvider;
import app.grafeo.security.UserPrincipal;
import app.grafeo.service.IndicatorService;
import app.grafeo.service.UserService;
import app.grafeo.util.AppConstants;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IndicatorRepository indicatorRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private IndicatorService indicatorService;

    @Autowired
    private UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        String newAccessToken = tokenProvider.generateToken(currentUser.getId());
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getEmail(), currentUser.getName(), currentUser.getIsDemo(), currentUser.getIsSocialLogin(), newAccessToken);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public UserProfile getUserProfile(@CurrentUser UserPrincipal currentUser) {

        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));

        long indicatorCount = indicatorRepository.countByCreatedBy(user.getId());
        long recordCount = recordRepository.countByCreatedBy(user.getId());

        return new UserProfile(user.getId(), user.getUsername(), user.getEmail(), user.getName(), user.getCreatedAt(), indicatorCount, recordCount);
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity updateCurrentUser(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody ProfileRequest profileRequest) {
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));

        User result = userService.updateUser(user, profileRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Profile updated successfully"));
    }

    @GetMapping("/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsernameIgnoreCase(username.trim());
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmailIgnoreCase(email.trim());
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/{id}/indicators")
    @PreAuthorize("hasRole('USER')")
    public PagedResponse<IndicatorResponse> getIndicatorsCreatedBy(@PathVariable(value = "id") Long id,
                                                                   @CurrentUser UserPrincipal currentUser,
                                                                   @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                                   @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return indicatorService.getIndicatorsCreatedBy(id, page, size);
    }
}
