package ch.sbb.atlas.model.validation;

import static ch.sbb.atlas.validation.ValidOnDemand.ATLAS_CONSTRAINT_VALID_ON_DEMAND;
import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.servicepoint.ServicePointVersionModel;
import ch.sbb.atlas.model.BaseValidatorTest;
import ch.sbb.atlas.servicepoint.enumeration.MeanOfTransport;
import ch.sbb.atlas.servicepoint.enumeration.StopPointType;
import ch.sbb.atlas.validation.ValidOnDemand;
import jakarta.validation.ConstraintViolation;
import java.util.List;
import java.util.Set;
import lombok.experimental.SuperBuilder;
import org.junit.jupiter.api.Test;

public class ValidOnDemandTest extends BaseValidatorTest {

  @Test
  void shouldValidateOnDemandWhenStopPointTypeAndMeanOfTransportAreBothOnDemand() {
    //given
    MyServicePointVersionModel servicePointVersionModel = MyServicePointVersionModel.builder()
        .meansOfTransport(List.of(MeanOfTransport.ON_DEMAND))
        .stopPointType(StopPointType.ON_DEMAND).build();
    //when
    Set<ConstraintViolation<MyServicePointVersionModel>> constraintViolations = validator.validate(servicePointVersionModel);
    //then
    boolean hasOnDemandViolation = constraintViolations.stream()
        .anyMatch(v -> v.getMessage().equals(ATLAS_CONSTRAINT_VALID_ON_DEMAND));
    assertThat(hasOnDemandViolation).isFalse();

  }

  @Test
  void shouldNotValidateOnDemandWhenMeansOfTransportIsNotOnDemand() {
    //given
    MyServicePointVersionModel servicePointVersionModel = MyServicePointVersionModel.builder()
        .meansOfTransport(List.of(MeanOfTransport.BUS))
        .stopPointType(StopPointType.ON_DEMAND).build();
    //when
    Set<ConstraintViolation<MyServicePointVersionModel>> constraintViolations = validator.validate(servicePointVersionModel);
    //then

    boolean hasOnDemandViolation = constraintViolations.stream()
        .anyMatch(v -> v.getMessage().equals(ATLAS_CONSTRAINT_VALID_ON_DEMAND));
    assertThat(hasOnDemandViolation).isTrue();

  }

  @Test
  void shouldNotValidateOnDemandWhenMeansOfTransportHasOnDemandAndAnotherMeansOfTransport() {
    //given
    MyServicePointVersionModel servicePointVersionModel = MyServicePointVersionModel.builder()
        .meansOfTransport(List.of(MeanOfTransport.BUS, MeanOfTransport.ON_DEMAND))
        .stopPointType(StopPointType.ON_DEMAND).build();
    //when
    Set<ConstraintViolation<MyServicePointVersionModel>> constraintViolations = validator.validate(servicePointVersionModel);
    //then

    boolean hasOnDemandViolation = constraintViolations.stream()
        .anyMatch(v -> v.getMessage().equals(ATLAS_CONSTRAINT_VALID_ON_DEMAND));
    assertThat(hasOnDemandViolation).isTrue();

  }

  @Test
  void shouldNotValidateOnDemandWhenStopPointTypeIsNotOnDemand() {
    //given
   MyServicePointVersionModel servicePointVersionModel = MyServicePointVersionModel.builder()
        .meansOfTransport(List.of(MeanOfTransport.ON_DEMAND))
        .stopPointType(StopPointType.ORDERLY).build();
    //when
    Set<ConstraintViolation<MyServicePointVersionModel>> constraintViolations = validator.validate(servicePointVersionModel);
    //then

    boolean hasOnDemandViolation = constraintViolations.stream()
        .anyMatch(v -> v.getMessage().equals(ATLAS_CONSTRAINT_VALID_ON_DEMAND));
    assertThat(hasOnDemandViolation).isTrue();

  }

  @ValidOnDemand
  @SuperBuilder
  static class MyServicePointVersionModel extends ServicePointVersionModel {

  }



}
