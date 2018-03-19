package ru.valaz.progressio.payload;

import java.time.Instant;

public class UserProfile {
    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private Long indicatorCount;
    private Long recordCount;

    public UserProfile(Long id, String username, String name, Instant joinedAt, Long indicatorCount, Long recordCount) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.indicatorCount = indicatorCount;
        this.recordCount = recordCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Long getIndicatorCount() {
        return indicatorCount;
    }

    public void setIndicatorCount(Long indicatorCount) {
        this.indicatorCount = indicatorCount;
    }

    public Long getRecordCount() {
        return recordCount;
    }

    public void setRecordCount(Long recordCount) {
        this.recordCount = recordCount;
    }
}
