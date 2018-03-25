package ru.valaz.progressio.payload;

import java.time.LocalDate;

public class RecordResponse implements Comparable<RecordResponse> {
    private long id;
    private Double value;
    private LocalDate date;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    @Override
    public int compareTo(RecordResponse o) {
        return date.compareTo(o.getDate());
    }
}
