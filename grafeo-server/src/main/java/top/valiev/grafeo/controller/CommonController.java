package top.valiev.grafeo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.valiev.grafeo.payload.GaUid;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Value("${ga:GAUID}")
    private String gaUid;

    private LocalDate startDate = LocalDate.now();

    @GetMapping("/ga")
    public GaUid getGaUid() {
        return new GaUid(gaUid);
    }

    @GetMapping("/fresh")
    public ResponseEntity isFresh() {
        if (LocalDate.now().equals(startDate)) {
            return ResponseEntity.ok().body("Started today");
        } else {
            return ResponseEntity.badRequest().body("Started on " + startDate);
        }
    }
}
