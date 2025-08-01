package ch.sbb.line.directory;

import ch.sbb.atlas.api.lidi.LineVersionModel;
import ch.sbb.atlas.api.lidi.LineVersionModel.LineVersionModelBuilder;
import ch.sbb.atlas.api.lidi.LineVersionModelV2;
import ch.sbb.atlas.api.lidi.LineVersionModelV2.LineVersionModelV2Builder;
import ch.sbb.atlas.api.lidi.UpdateLineVersionModelV2;
import ch.sbb.atlas.api.lidi.UpdateLineVersionModelV2.UpdateLineVersionModelV2Builder;
import ch.sbb.atlas.api.lidi.enumaration.LidiElementType;
import ch.sbb.atlas.api.lidi.enumaration.LineConcessionType;
import ch.sbb.atlas.api.lidi.enumaration.LineType;
import ch.sbb.atlas.api.lidi.enumaration.OfferCategory;
import ch.sbb.atlas.api.lidi.enumaration.PaymentType;
import ch.sbb.atlas.model.Status;
import ch.sbb.line.directory.entity.Line;
import ch.sbb.line.directory.entity.Line.LineBuilder;
import ch.sbb.line.directory.entity.LineVersion;
import ch.sbb.line.directory.entity.LineVersion.LineVersionBuilder;
import ch.sbb.line.directory.model.CmykColor;
import ch.sbb.line.directory.model.RgbColor;
import java.time.LocalDate;
import java.util.Collections;
import lombok.experimental.UtilityClass;

@UtilityClass
public class LineTestData {

  public static final RgbColor RBG_YELLOW = new RgbColor(255, 255, 0);
  public static final RgbColor RBG_RED = new RgbColor(255, 0, 0);
  public static final RgbColor RGB_BLACK = new RgbColor(0, 0, 0);

  private static final CmykColor CYMK_COLOR = new CmykColor(0, 0, 0, 0);

  public static LineVersionBuilder<?, ?> lineVersionBuilder() {
    return LineVersion.builder()
        .status(Status.VALIDATED)
        .lineType(LineType.ORDERLY)
        .paymentType(PaymentType.INTERNATIONAL)
        .number("number")
        .alternativeName("alternativeName")
        .combinationName("combinationName")
        .longName("longName")
        .colorFontRgb(RGB_BLACK)
        .colorBackRgb(RGB_BLACK)
        .colorFontCmyk(CYMK_COLOR)
        .colorBackCmyk(CYMK_COLOR)
        .description("description")
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .businessOrganisation("businessOrganisation")
        .comment("comment")
        .swissLineNumber("swissLineNumber");
  }

  public static LineVersionBuilder<?, ?> lineVersionV2Builder() {
    return lineVersionBuilder()
        .concessionType(LineConcessionType.COLLECTION_LINE)
        .shortNumber("6")
        .offerCategory(OfferCategory.IC);
  }

  public static LineVersion lineVersion() {
    return lineVersionBuilder().build();
  }

  public static LineVersionModelBuilder<?, ?> lineVersionModelBuilder() {
    return LineVersionModel.builder()
        .status(Status.VALIDATED)
        .lineType(LineType.ORDERLY)
        .paymentType(PaymentType.INTERNATIONAL)
        .number("number")
        .alternativeName("alternativeName")
        .combinationName("combinationName")
        .longName("longName")
        .colorFontRgb("#FFFFFF")
        .colorBackRgb("#FFFFFF")
        .colorFontCmyk("0,0,0,0")
        .colorBackCmyk("0,0,0,0")
        .description("description")
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .businessOrganisation(
            "businessOrganisation")
        .comment("comment")
        .lineVersionWorkflows(Collections.emptySet())
        .swissLineNumber("swissLineNumber");
  }

  public static LineVersionModelV2Builder<?, ?> createLineVersionModelBuilder() {
    return LineVersionModelV2.builder()
        .status(Status.VALIDATED)
        .lineType(LineType.ORDERLY)
        .lineConcessionType(LineConcessionType.COLLECTION_LINE)
        .offerCategory(OfferCategory.IC)
        .shortNumber("6")
        .number("number")
        .longName("longName")
        .description("description")
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .businessOrganisation("businessOrganisation")
        .comment("comment")
        .lineVersionWorkflows(Collections.emptySet())
        .swissLineNumber("swissLineNumber");
  }

  public static UpdateLineVersionModelV2Builder<?, ?> updateLineVersionModelBuilder() {
    return UpdateLineVersionModelV2.builder()
        .status(Status.VALIDATED)
        .lineConcessionType(LineConcessionType.COLLECTION_LINE)
        .offerCategory(OfferCategory.IC)
        .shortNumber("6")
        .number("number")
        .longName("longName")
        .description("description")
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .businessOrganisation(
            "businessOrganisation")
        .comment("comment")
        .lineVersionWorkflows(Collections.emptySet())
        .swissLineNumber("swissLineNumber");
  }

  public static LineBuilder lineBuilder() {
    return Line.builder()
        .status(Status.VALIDATED)
        .lidiElementType(LidiElementType.CONCESSION)
        .number("number")
        .description("description")
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .businessOrganisation(
            "businessOrganisation")
        .swissLineNumber("swissLineNumber");
  }

  public static Line line() {
    return lineBuilder().build();
  }
}
