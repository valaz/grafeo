package ru.valaz.progressio.model;

import com.google.gson.annotations.Expose;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
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
@Table(name = "indicators")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Indicator extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    @Size(max = 140)
    @NonNull
    @Expose
    private String name;

    @NotBlank
    @Size(max = 4)
    @Expose
    private String unit;

    @OneToMany(
            mappedBy = "indicator",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @Fetch(FetchMode.SELECT)
    @BatchSize(size = 30)
    @Expose
    private List<Record> records = new ArrayList<>();

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
        newRecord.setCreatedBy(this.getCreatedBy());
        newRecord.setUpdatedBy(this.getUpdatedBy());
    }

    public void addRecords(Iterable<Record> newRecords) {
        for (Record newRecord : newRecords) {
            records.add(newRecord);
            newRecord.setIndicator(this);
            newRecord.setCreatedBy(this.getCreatedBy());
            newRecord.setUpdatedBy(this.getUpdatedBy());
        }
        this.setUpdatedAt(Instant.now());
    }

    public void removeRecord(LocalDate date) {
        records.stream()
                .filter(r -> r.getDate().equals(date))
                .findFirst()
                .ifPresent(r -> records.remove(r));
        this.setUpdatedAt(Instant.now());
    }

    public void clearRecords() {
        records.clear();
        this.setUpdatedAt(Instant.now());
    }
}
