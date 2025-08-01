package ch.sbb.line.directory.entity;

import ch.sbb.atlas.api.AtlasFieldLengths;
import ch.sbb.atlas.api.lidi.enumaration.LineConcessionType;
import ch.sbb.atlas.api.lidi.enumaration.LineType;
import ch.sbb.atlas.api.lidi.enumaration.OfferCategory;
import ch.sbb.atlas.api.lidi.enumaration.PaymentType;
import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.versioning.annotation.AtlasVersionableProperty;
import ch.sbb.atlas.workflow.model.BaseVersionSnapshot;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Version;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.UpdateTimestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@SuperBuilder
@FieldNameConstants
@Entity(name = "line_version_snapshot")
public class LineVersionSnapshot extends BaseVersionSnapshot {

  private static final String VERSION_SNAPSHOT_SEQ = "line_version_snapshot_seq";

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = VERSION_SNAPSHOT_SEQ)
  @SequenceGenerator(name = VERSION_SNAPSHOT_SEQ, sequenceName = VERSION_SNAPSHOT_SEQ, allocationSize = 1, initialValue = 1000)
  private Long id;

  @NotBlank
  @Size(max = AtlasFieldLengths.LENGTH_50)
  private String swissLineNumber;

  private String slnid;

  @NotNull
  @Enumerated(EnumType.STRING)
  private LineType lineType;

  @NotNull
  @Enumerated(EnumType.STRING)
  private Status status;

  @Enumerated(EnumType.STRING)
  private PaymentType paymentType;

  @Size(max = AtlasFieldLengths.LENGTH_50)
  private String number;

  @Size(max = AtlasFieldLengths.LENGTH_255)
  private String longName;

  @Size(max = AtlasFieldLengths.LENGTH_255)
  private String description;

  @NotNull
  @Column(columnDefinition = "TIMESTAMP")
  private LocalDate validFrom;

  @NotNull
  @Column(columnDefinition = "TIMESTAMP")
  private LocalDate validTo;

  @NotBlank
  @Size(max = AtlasFieldLengths.LENGTH_50)
  private String businessOrganisation;

  @Size(max = AtlasFieldLengths.LENGTH_1500)
  private String comment;

  @Column(columnDefinition = "TIMESTAMP", updatable = false)
  private LocalDateTime creationDate;

  @Column(updatable = false)
  private String creator;

  @UpdateTimestamp
  @Column(columnDefinition = "TIMESTAMP")
  private LocalDateTime editionDate;

  private String editor;

  @Version
  @NotNull
  private Integer version;

  @Enumerated(EnumType.STRING)
  @AtlasVersionableProperty
  private LineConcessionType concessionType;

  @Enumerated(EnumType.STRING)
  @AtlasVersionableProperty
  private OfferCategory offerCategory;

  @Size(max = AtlasFieldLengths.LENGTH_10)
  @AtlasVersionableProperty
  private String shortNumber;

}
