package ru.valaz.progressio.payload;

import java.time.Instant;
import java.util.List;

public class IndicatorResponse {
    private Long id;
    private String name;
    private List<RecordResponse> records;
    private UserSummary createdBy;
    private Instant creationDateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RecordResponse> getRecords() {
        return records;
    }

    public void setRecords(List<RecordResponse> records) {
        this.records = records;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }
}
