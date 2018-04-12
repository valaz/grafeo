package ru.valaz.progressio.payload;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class IndicatorResponse {
    private Long id;
    private String name;
    private String unit;
    private List<RecordResponse> records;
    private UserSummary createdBy;
    private Instant creationDateTime;

}
