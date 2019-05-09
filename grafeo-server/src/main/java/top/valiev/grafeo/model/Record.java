package top.valiev.grafeo.model;

import com.google.gson.annotations.Expose;
import lombok.*;
import top.valiev.grafeo.model.audit.UserDateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "records")

@Data
@NoArgsConstructor
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
