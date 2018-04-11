package ru.valaz.progressio.payload;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RecordResponse implements Comparable<RecordResponse> {
    private long id;
    private Double value;
    private LocalDate date;

    @Override
    public int compareTo(RecordResponse o) {
        return date.compareTo(o.getDate());
    }
}
