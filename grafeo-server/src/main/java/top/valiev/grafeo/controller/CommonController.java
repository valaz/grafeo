package top.valiev.grafeo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.valiev.grafeo.payload.GaUid;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Value("${ga:GAUID}")
    private String gaUid;

    private static final LocalDateTime startDate = LocalDateTime.now();

    @GetMapping("/ga")
    public GaUid getGaUid() {
        return new GaUid(gaUid);
    }

    @GetMapping("/fresh")
    public ResponseEntity isFresh() {
        LocalDateTime now = LocalDateTime.now();
        long periodAfterStart = ChronoUnit.MINUTES.between(startDate, now);
        if (periodAfterStart < 10) {
            return ResponseEntity.ok().body("Started recently");
        } else {
            return ResponseEntity.badRequest().body("Started not recently:" + startDate);
        }
    }
}
