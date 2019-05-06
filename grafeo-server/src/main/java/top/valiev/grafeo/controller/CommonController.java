package top.valiev.grafeo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.valiev.grafeo.payload.GaUid;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Value("${ga:GAUID}")
    private String gaUid;

    @GetMapping("/ga")
    public GaUid getGaUid() {
        return new GaUid(gaUid);
    }
}
