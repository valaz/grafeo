package ru.valaz.progressio.model;

import com.google.gson.annotations.Expose;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import ru.valaz.progressio.model.audit.UserDateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "records")

@Data
@RequiredArgsConstructor
@EqualsAndHashCode(of = {"id"}, callSuper = true)
public class Record extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NonNull
    @Expose
    private Double value;

    @NotNull
    @NonNull
    @Expose
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "indicator_id", nullable = false)
    private Indicator indicator;
}
