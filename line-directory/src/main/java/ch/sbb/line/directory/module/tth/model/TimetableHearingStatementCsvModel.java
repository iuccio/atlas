package ch.sbb.line.directory.module.tth.model;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementModelV2;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementResponsibleTransportCompanyModel;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementSenderModelV2;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"cantonAbbreviation", "timetableFieldNumber", "timetableFieldNumberDescription", "stopPlace",
    "timetabeHearingStatementId", "transportCompanyAbbreviations", "transportCompanyDescriptions", "statement",
    "documentsPresent", "status", "firstName", "lastName", "organisation",
    "street", "zipAndCity", "emails", "timetableHearingYear", "statementAnonymous",
    "anonymousStatement", "publicComment", "internalComment", "topic"})
public class TimetableHearingStatementCsvModel {

  private String cantonAbbreviation;
  private String timetableFieldNumber;
  private String timetableFieldNumberDescription;
  private String stopPlace;
  private Long timetabeHearingStatementId;
  private String transportCompanyAbbreviations;
  private String transportCompanyDescriptions;
  private String statement;
  private Boolean documentsPresent;
  private StatementStatus status;
  private String firstName;
  private String lastName;
  private String organisation;
  private String street;
  private String zipAndCity;
  private String emails;
  private Long timetableHearingYear;

  private Boolean statementAnonymous;
  private String anonymousStatement;
  private String publicComment;
  private String internalComment;
  private String topic;

  private static TimetableHearingStatementCsvModel.TimetableHearingStatementCsvModelBuilder baseBuilder(
      TimetableHearingStatementModelV2 statementModelV2
  ) {
    return TimetableHearingStatementCsvModel.builder()
        .cantonAbbreviation(statementModelV2.getSwissCanton().getAbbreviation())
        .timetableFieldNumber(statementModelV2.getTimetableFieldNumber())
        .timetableFieldNumberDescription(statementModelV2.getTimetableFieldDescription())
        .stopPlace(statementModelV2.getStopPlace())
        .timetabeHearingStatementId(statementModelV2.getId())
        .transportCompanyAbbreviations(
            statementModelV2.getResponsibleTransportCompanies().stream()
                .map(TimetableHearingStatementResponsibleTransportCompanyModel::getAbbreviation)
                .filter(Objects::nonNull)
                .sorted()
                .collect(Collectors.joining(",")))
        .transportCompanyDescriptions(
            statementModelV2.getResponsibleTransportCompanies().stream()
                .map(TimetableHearingStatementResponsibleTransportCompanyModel::getBusinessRegisterName)
                .filter(Objects::nonNull)
                .sorted()
                .collect(Collectors.joining(",")))
        .documentsPresent(!statementModelV2.getDocuments().isEmpty())
        .status(statementModelV2.getStatementStatus())
        .timetableHearingYear(statementModelV2.getTimetableYear())
        .statementAnonymous(statementModelV2.isStatementAnonymous())
        .topic(statementModelV2.getTopic());
  }

  public static TimetableHearingStatementCsvModel fromModel(TimetableHearingStatementModelV2 timetableHearingStatementModelV2) {
    TimetableHearingStatementSenderModelV2 sender = timetableHearingStatementModelV2.getStatementSender();

    return baseBuilder(timetableHearingStatementModelV2)
        .firstName(sender.getFirstName())
        .lastName(sender.getLastName())
        .organisation(sender.getOrganisation())
        .street(sender.getStreet())
        .zipAndCity(getZipAndCity(sender.getZip(), sender.getCity()))
        .emails(sender.getEmails().stream().sorted().collect(Collectors.joining(",")))
        .statement(timetableHearingStatementModelV2.getStatement())
        .anonymousStatement(timetableHearingStatementModelV2.getAnonymousStatement())
        .publicComment(timetableHearingStatementModelV2.getPublicComment())
        .internalComment(timetableHearingStatementModelV2.getInternalComment())
        .build();
  }

  public static TimetableHearingStatementCsvModel fromModelAnonymized(TimetableHearingStatementModelV2 statementModelV2) {
    TimetableHearingStatementCsvModel csvModel = baseBuilder(statementModelV2).build();

    if (statementModelV2.isStatementAnonymous()) {
      csvModel.setStatement(statementModelV2.getStatement());
    } else {
      csvModel.setAnonymousStatement(statementModelV2.getAnonymousStatement());
    }

    return csvModel;
  }

  public static String getZipAndCity(Integer zip, String city) {
    if (zip == null) {
      return Objects.requireNonNullElse(city, "");
    } else if (city == null || city.isEmpty()) {
      return zip.toString();
    } else {
      return zip + "/" + city;
    }
  }

}
