package ru.valaz.progressio.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class IndicatorRequest {

    private Long id;

    @NotBlank
    @Size(max = 140)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
