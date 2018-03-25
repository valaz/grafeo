package ru.valaz.progressio.payload;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class RecordRequest {

    @NotNull
    private Long indicatorId;

    @NotNull
    private Double value;

    @NotNull
    private LocalDate date;

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getIndicatorId() {
        return indicatorId;
    }

    public void setIndicatorId(Long indicatorId) {
        this.indicatorId = indicatorId;
    }
}
