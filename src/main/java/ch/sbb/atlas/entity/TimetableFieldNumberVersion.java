package ch.sbb.atlas.entity;

import ch.sbb.atlas.enumaration.Status;
import ch.sbb.atlas.enumaration.Type;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "timetable_field_number_version")
@Data
public class TimetableFieldNumberVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "timetable_field_number_version_seq")
    private Long id;

    private String fpfnid;

    private String name;

    private String number;

    private String swissTimetableFieldNumber;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime creationDate;

    private String creator;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime editionDate;

    private String editor;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDate validFrom;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDate validTo;

    private String businessOrganisation;

    private String comment;

    @Enumerated(EnumType.STRING)
    private Type type;

    private String nameCompact;


}
