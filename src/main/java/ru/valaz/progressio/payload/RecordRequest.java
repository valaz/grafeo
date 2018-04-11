package ru.valaz.progressio.payload;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class RecordRequest {

    @NotNull
    private Long indicatorId;

    @NotNull
    private Double value;

    @NotNull
    private LocalDate date;
}
