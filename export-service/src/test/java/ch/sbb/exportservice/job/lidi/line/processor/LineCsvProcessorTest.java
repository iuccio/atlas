package ch.sbb.exportservice.job.lidi.line.processor;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.lidi.enumaration.LineConcessionType;
import ch.sbb.atlas.api.lidi.enumaration.LineType;
import ch.sbb.atlas.api.lidi.enumaration.OfferCategory;
import ch.sbb.atlas.model.Status;
import ch.sbb.exportservice.job.lidi.line.entity.Line;
import ch.sbb.exportservice.job.lidi.line.model.LineCsvModel;
import ch.sbb.exportservice.util.MapperUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class LineCsvProcessorTest {

  @Test
  void shouldMapToCsvCorrectly() {
    Line line = Line.builder()
        .id(1L)
        .slnid("ch:1:slnid:100000")
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 12, 31))
        .status(Status.VALIDATED)
        .lineType(LineType.ORDERLY)
        .concessionType(LineConcessionType.LINE_OF_A_ZONE_CONCESSION)
        .swissLineNumber("r.01")
        .description("Linie 1")
        .number("1")
        .offerCategory(OfferCategory.B)
        .businessOrganisation("ch:1:sboid:10000011")
        .creator("creator")
        .creationDate(LocalDateTime.of(2024, 2, 7, 20, 0))
        .editor("editor")
        .editionDate(LocalDateTime.of(2024, 2, 7, 20, 0))
        .version(0)
        .build();

    LineCsvModel expected = LineCsvModel.builder()
        .slnid("ch:1:slnid:100000")
        .validFrom("2000-01-01")
        .validTo("2000-12-31")
        .status(Status.VALIDATED)
        .lineType(LineType.ORDERLY)
        .concessionType(LineConcessionType.LINE_OF_A_ZONE_CONCESSION)
        .swissLineNumber("r.01")
        .description("Linie 1")
        .number("1")
        .offerCategory(OfferCategory.B)
        .businessOrganisation("ch:1:sboid:10000011")
        .creationTime(MapperUtil.LOCAL_DATE_FORMATTER.format(LocalDateTime.of(2024, 2, 7, 20, 0)))
        .editionTime(MapperUtil.LOCAL_DATE_FORMATTER.format(LocalDateTime.of(2024, 2, 7, 20, 0)))
        .build();

    LineCsvModel result = new LineCsvProcessor().process(line);
    assertThat(result).isEqualTo(expected);
  }
}