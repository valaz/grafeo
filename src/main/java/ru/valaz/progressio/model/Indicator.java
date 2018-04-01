package ru.valaz.progressio.model;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import ru.valaz.progressio.model.audit.UserDateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "indicarors")
public class Indicator extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    @Size(max = 140)
    private String name;

    @OneToMany(
            mappedBy = "indicator",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @Fetch(FetchMode.SELECT)
    @BatchSize(size = 30)
    private List<Record> records = new ArrayList<>();

    public Indicator() {
    }

    public Indicator(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Record> getRecords() {
        return records;
    }

    public void setRecords(List<Record> choices) {
        this.records = choices;
    }

    public void addRecord(Record newRecord) {
        Optional<Record> currentRecord = records.stream()
                .filter(r -> r.getDate().equals(newRecord.getDate()))
                .findFirst();

        if (currentRecord.isPresent()) {
            Record oldRecord = currentRecord.get();
            if (oldRecord.getValue().equals(newRecord.getValue())) {
                return;
            } else {
                records.remove(oldRecord);
            }
        }
        records.add(newRecord);
        this.setUpdatedAt(Instant.now());
        newRecord.setIndicator(this);
    }

    public void removeRecord(Record record) {
        records.remove(record);
        this.setUpdatedAt(Instant.now());
        record.setIndicator(null);
    }

    public void removeRecord(LocalDate date) {
        records.stream()
                .filter(r -> r.getDate().equals(date))
                .findFirst()
                .ifPresent(r -> records.remove(r));
        setUpdatedAt(Instant.now());
        this.setUpdatedAt(Instant.now());

    }
}
