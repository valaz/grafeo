package ru.valaz.progressio.payload;

import com.google.common.base.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecordResponse that = (RecordResponse) o;
        return id == that.id &&
                Objects.equal(value, that.value) &&
                Objects.equal(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, value, date);
    }
}
