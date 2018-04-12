package ru.valaz.progressio.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class IndicatorRequest {

    private Long id;

    @NotBlank
    @Size(max = 140)
    private String name;

    @NotBlank
    @Size(max = 4)
    private String unit;

}
