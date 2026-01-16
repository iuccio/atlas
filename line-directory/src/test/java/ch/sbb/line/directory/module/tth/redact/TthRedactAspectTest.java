package ch.sbb.line.directory.module.tth.redact;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.user.administration.security.redact.TthRedactAspect;
import ch.sbb.line.directory.module.tth.entity.StatementDocument;
import ch.sbb.line.directory.module.tth.entity.StatementSender;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingStatement;
import ch.sbb.line.directory.shared.transportcompany.entity.SharedTransportCompany;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TthRedactAspectTest {

  @Test
  void shouldRedactStatementCorrectly() {
    // given
    TimetableHearingStatement sensitiveStatement = TimetableHearingStatement.builder()
        .timetableYear(2023L)
        .statementStatus(StatementStatus.RECEIVED)
        .statement("Ich mag bitte mehr Bös fahren")
        .version(1)
        .ttfnid("ch:1:ttfnid:1235234")
        .swissCanton(SwissCanton.BERN)
        .stopPlace("Erste Haltestelle ... weisst ja")
        .responsibleTransportCompanies(Set.of(SharedTransportCompany.builder()
            .id(1L)
            .number("#0001")
            .abbreviation("SBB")
            .businessRegisterName("Schweizerische Bundesbahnen")
            .build()))
        .statementSender(StatementSender.builder()
            .firstName("Mike")
            .lastName("von Bike")
            .organisation("Bewerber")
            .street("Hauptstrasse 1")
            .zip(39012)
            .city("Algund")
            .emails(List.of("mike@thebike.com"))
            .build())
        .publicComment("Weil ich mag")
        .documents(Set.of(StatementDocument.builder()
            .fileName("doc1")
            .fileSize(6454L)
            .build()))
        .build();

    TimetableHearingStatement redactedStatement = TimetableHearingStatement.builder()
        .timetableYear(2023L)
        .statementStatus(StatementStatus.RECEIVED)
        .statement("*****")
        .version(1)
        .ttfnid("ch:1:ttfnid:1235234")
        .swissCanton(SwissCanton.BERN)
        .stopPlace("Erste Haltestelle ... weisst ja")
        .responsibleTransportCompanies(Set.of(SharedTransportCompany.builder()
            .id(1L)
            .number("#0001")
            .abbreviation("SBB")
            .businessRegisterName("Schweizerische Bundesbahnen")
            .build()))
        .statementSender(StatementSender.builder()
            .firstName("*****")
            .lastName("*****")
            .organisation("*****")
            .street("*****")
            .zip(0)
            .city("*****")
            .emails(List.of("*****"))
            .build())
        .publicComment("*****")
        .documents(Set.of(StatementDocument.builder()
            .fileName("doc1")
            .fileSize(6454L)
            .build()))
        .build();

    // when & then
    Object redactObject = TthRedactAspect.redactObject(sensitiveStatement);
    assertThat(redactObject).usingRecursiveComparison().isEqualTo(redactedStatement);
  }

  @Test
  void shouldRedactZipIntegerWhenNull() {
    // given
    TimetableHearingStatement sensitiveStatement = TimetableHearingStatement.builder()
        .timetableYear(2023L)
        .statementStatus(StatementStatus.RECEIVED)
        .statement("Ich mag bitte mehr Bös fahren")
        .statementSender(StatementSender.builder()
            .zip(null)
            .emails(List.of("mike@thebike.com"))
            .build())
        .build();

    TimetableHearingStatement redactedStatement = TimetableHearingStatement.builder()
        .timetableYear(2023L)
        .statementStatus(StatementStatus.RECEIVED)
        .statement("*****")
        .statementSender(StatementSender.builder()
            .zip(null)
            .emails(List.of("*****"))
            .build())
        .build();

    // when & then
    Object redactObject = TthRedactAspect.redactObject(sensitiveStatement);
    assertThat(redactObject).usingRecursiveComparison().isEqualTo(redactedStatement);
  }
}
