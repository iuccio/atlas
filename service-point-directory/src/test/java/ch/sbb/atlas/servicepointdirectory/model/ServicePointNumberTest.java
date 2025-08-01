package ch.sbb.atlas.servicepointdirectory.model;

import static ch.sbb.atlas.servicepoint.Country.SLOID_COMPATIBLE_COUNTRIES;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import ch.sbb.atlas.servicepoint.Country;
import ch.sbb.atlas.servicepoint.ServicePointNumber;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ServicePointNumberTest {

  private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

  @Test
  void shouldGetCountrySuccessfully() {
    assertThat(ServicePointNumber.ofNumberWithoutCheckDigit(8507000).getCountry()).isEqualTo(Country.SWITZERLAND);
  }

  @Test
  void shouldGetServicePointIdSuccessfully() {
    assertThat(ServicePointNumber.ofNumberWithoutCheckDigit(8507000).getNumberShort()).isEqualTo(7000);
  }

  @Test
  void shouldCheckDigitSuccessfully() {
    assertThat(ServicePointNumber.ofNumberWithoutCheckDigit(8507000).getCheckDigit()).isEqualTo(3);
  }

  @Test
  void shouldCheckServicePointNumberLength() {
    assertThrows(IllegalArgumentException.class,
            () -> ServicePointNumber.ofNumberWithoutCheckDigit(85070008));
  }

  @Test
  void shouldCheckServicePointCountry() {
    Set<ConstraintViolation<ServicePointNumber>> constraintViolations = validator.validate(ServicePointNumber.ofNumberWithoutCheckDigit(1500000));
    assertThat(constraintViolations).isNotEmpty();
  }

  @Test
  void shouldCalculateCheckDigitCorrectly() {
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 7000).getCheckDigit()).isEqualTo(3);
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 92223).getCheckDigit()).isEqualTo(7);
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 89573).getCheckDigit()).isEqualTo(0);
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 94267).getCheckDigit()).isEqualTo(2);
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 90765).getCheckDigit()).isEqualTo(9);
    assertThat(ServicePointNumber.of(Country.SWITZERLAND, 91085).getCheckDigit()).isEqualTo(1);
  }

  @Test
  void shouldBuildServicePointNumberFromSevenDigitNumberSuccessfully() {
    ServicePointNumber servicePointNumber = ServicePointNumber.ofNumberWithoutCheckDigit(8507000);
    assertThat(servicePointNumber.getValue()).isEqualTo(8507000);
  }

  @Test
  void shouldCalculateSloidForCh(){
    //given
    ServicePointNumber ch = ServicePointNumber.of(Country.SWITZERLAND, 92223);

    //when
    String result = ServicePointNumber.calculateSloid(ch);

    //then
    assertThat(result).isEqualTo("ch:1:sloid:92223");
  }

  @Test
  void shouldCalculateSloidForItBus(){
    //given
    ServicePointNumber ch = ServicePointNumber.of(Country.ITALY_BUS, 92223);

    //when
    String result = ServicePointNumber.calculateSloid(ch);

    //then
    assertThat(result).isEqualTo("ch:1:sloid:1392223");
  }

  @Test
  void shouldCalculateSloidForDeBus(){
    //given
    ServicePointNumber ch = ServicePointNumber.of(Country.GERMANY_BUS, 92223);

    //when
    String result = ServicePointNumber.calculateSloid(ch);

    //then
    assertThat(result).isEqualTo("ch:1:sloid:1192223");
  }

  @Test
  void shouldCalculateSloidForAuBus(){
    //given
    ServicePointNumber ch = ServicePointNumber.of(Country.AUSTRIA_BUS, 92223);

    //when
    String result = ServicePointNumber.calculateSloid(ch);

    //then
    assertThat(result).isEqualTo("ch:1:sloid:1292223");
  }

  @Test
  void shouldCalculateSloidForFrBus(){
    //given
    ServicePointNumber ch = ServicePointNumber.of(Country.FRANCE_BUS, 92223);

    //when
    String result = ServicePointNumber.calculateSloid(ch);

    //then
    assertThat(result).isEqualTo("ch:1:sloid:1492223");
  }

  @Test
  void shouldCalculateSloidForNotSwissCompatible() {
    //given
    List<Country> swissCompatibleSloidCountry = new ArrayList<>();
    swissCompatibleSloidCountry.add(Country.SWITZERLAND);
    swissCompatibleSloidCountry.addAll(SLOID_COMPATIBLE_COUNTRIES);
    List<Country> notSwissCompatibleList = Arrays.stream(Country.values()).filter(c -> !swissCompatibleSloidCountry.contains(c)).toList();

    //when
    notSwissCompatibleList.forEach(country -> {
      if (country.getUicCode() != null) {
      ServicePointNumber sp = ServicePointNumber.of(country, 92223);
        //then
        String result = ServicePointNumber.calculateSloid(sp);
        assertThat(result).isNull();
      }
    });

  }

  @Test
  void shouldThrowIllegalStateExceptionWhenUicCountryNotProvided() {
    //given
    List<Country> notSwissCompatibleList = Arrays.stream(Country.values()).filter(c -> c.getUicCode() == null).toList();

    //when
    notSwissCompatibleList.forEach(country -> {
      if (country.getUicCode() != null) {
        //then
        assertThrows(IllegalStateException.class, () -> ServicePointNumber.of(country, 92223));
      }
    });

  }

  @Test
   void shouldRemoveCheckDigit(){
    //when
    Integer result = ServicePointNumber.removeCheckDigit(85070003);
    //then
    assertThat(String.valueOf(result)).hasSize(7);
  }

  @Test
   void shouldReturnNumberWithoutCheckDigit(){
    //when
    Integer result = ServicePointNumber.removeCheckDigit(8507000);
    //then
    assertThat(String.valueOf(result)).hasSize(7);
    assertThat(result).isEqualTo(8507000);
  }

}