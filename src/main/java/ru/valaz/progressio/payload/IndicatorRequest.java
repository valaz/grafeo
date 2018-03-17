package ru.valaz.progressio.payload;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

public class IndicatorRequest {

    @NotBlank
    @Size(max = 140)
    private String name;

    @NotNull
    @Valid
    private List<RecordRequest> records;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RecordRequest> getRecords() {
        return records;
    }

    public void setRecords(List<RecordRequest> records) {
        this.records = records;
    }
}
