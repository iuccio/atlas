package ch.sbb.atlas.servicepointdirectory.service.servicepoint;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.servicepoint.ReadServicePointVersionModel;
import ch.sbb.atlas.api.servicepoint.UpdateDesignationOfficialServicePointModel;
import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.model.exception.NotFoundException.IdNotFoundException;
import ch.sbb.atlas.servicepoint.ServicePointNumber;
import ch.sbb.atlas.servicepointdirectory.ServicePointTestData;
import ch.sbb.atlas.servicepointdirectory.entity.ServicePointVersion;
import ch.sbb.atlas.servicepointdirectory.mapper.ServicePointVersionMapper;
import ch.sbb.atlas.servicepointdirectory.repository.ServicePointSearchVersionRepository;
import ch.sbb.atlas.servicepointdirectory.repository.ServicePointVersionRepository;
import ch.sbb.atlas.servicepointdirectory.service.ServicePointDistributor;
import ch.sbb.atlas.versioning.service.VersionableService;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.hibernate.StaleObjectStateException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ServicePointServiceTest {

  private ServicePointService servicePointService;

  @Mock
  private ServicePointVersionRepository servicePointVersionRepositoryMock;

  @Mock
  private VersionableService versionableServiceMock;

  @Mock
  private ServicePointValidationService servicePointValidationService;

  @Mock
  private ServicePointTerminationService servicePointTerminationService;

  @Mock
  private ServicePointVersionMapper servicePointVersionMapper;

  @Mock
  private ServicePointSearchVersionRepository servicePointSearchVersionRepository;

  @Mock
  private ServicePointDistributor servicePointDistributor;

  @BeforeEach
  void initMocksAndService() {
    MockitoAnnotations.openMocks(this);
    servicePointService = new ServicePointService(servicePointVersionRepositoryMock, versionableServiceMock,
        servicePointValidationService, servicePointTerminationService, servicePointDistributor);
  }

  @Test
  void shouldFindServicePoint() {
    // given
    ServicePointNumber servicePointNumber = ServicePointNumber.ofNumberWithoutCheckDigit(1234567);

    // when
    servicePointService.findAllByNumberOrderByValidFrom(servicePointNumber);

    // then
    verify(servicePointVersionRepositoryMock).findAllByNumberOrderByValidFrom(eq(servicePointNumber));
  }

  @Test
  void shouldCallExistsByServicePointNumber() {
    // given
    ServicePointNumber servicePointNumber = ServicePointNumber.ofNumberWithoutCheckDigit(1234567);

    // when
    servicePointService.isServicePointNumberExisting(servicePointNumber);

    // then
    verify(servicePointVersionRepositoryMock).existsByNumber(eq(servicePointNumber));
  }

  @Test
  void shouldCallFindById() {
    // given & when
    servicePointService.findById(123L);

    // then
    verify(servicePointVersionRepositoryMock).findById(eq(123L));
  }

  @Test
  void shouldUpdateServicePointVersion() {
    //given
    ServicePointVersion version1 = ServicePointVersion.builder()
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 6, 1))
        .version(0)
        .build();
    ServicePointVersion edited = ServicePointVersion.builder()
        .validFrom(LocalDate.of(2000, 1, 2))
        .validTo(LocalDate.of(2000, 12, 30))
        .version(0)
        .build();
    //when
    ServicePointVersion result = servicePointService.updateServicePointVersion(version1, edited, Collections.emptyList());
    //then
    assertThat(result).isNotNull();
    assertThat(result.getValidFrom()).isEqualTo(LocalDate.of(2000, 1, 2));
    assertThat(result.getValidTo()).isEqualTo(LocalDate.of(2000, 12, 30));

    verify(servicePointTerminationService).checkTerminationAllowed(anyList(), anyList());
  }

  @Test
  void shouldUpdateStopPointStatusForWorkflow() {
    //given
    ServicePointVersion version = ServicePointTestData.getBernWyleregg();
    version.setStatus(Status.DRAFT);
    //when
    ServicePointVersion result = servicePointService.updateStopPointStatusForWorkflow(version, List.of(version),
        Status.IN_REVIEW);
    //then
    assertThat(result).isNotNull();
    assertThat(result.getStatus()).isEqualTo(Status.IN_REVIEW);
    verify(servicePointVersionRepositoryMock).save(version);
  }

  @Test
  void shouldUpdateServicePointVersionAndThrowException() {
    //given
    ServicePointVersion version1 = ServicePointVersion.builder()
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 6, 1))
        .build();
    version1.setVersion(1);
    ServicePointVersion version2 = ServicePointVersion.builder()
        .validFrom(LocalDate.of(2000, 6, 2))
        .validTo(LocalDate.of(2000, 12, 31))
        .build();
    version2.setVersion(2);
    // when then
    assertThrows(StaleObjectStateException.class,
        () -> servicePointService.updateServicePointVersion(version1, version2, Collections.emptyList()));
  }

  @Test
  void shouldUpdateServicePointDesignationOfficial() {
    ServicePointVersion version1 = ServicePointVersion.builder()
        .id(1000L)
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 6, 1))
        .designationOfficial("Alt")
        .number(ServicePointNumber.ofNumberWithoutCheckDigit(1234567))
        .version(0)
        .build();

    UpdateDesignationOfficialServicePointModel updateDesignationOfficialServicePointModel =
        UpdateDesignationOfficialServicePointModel
            .builder()
            .designationOfficial("test")
            .build();

    when(servicePointVersionRepositoryMock.findById(1000L)).thenReturn(Optional.of(version1));
    when(servicePointVersionRepositoryMock.findAllByNumberOrderByValidFrom(
        ServicePointNumber.ofNumberWithoutCheckDigit(1234567))).thenReturn(List.of(version1));

    ReadServicePointVersionModel result = servicePointService.updateDesignationOfficial(1000L,
        updateDesignationOfficialServicePointModel);

    assertThat(result).isNotNull();
    assertThat(result.getDesignationOfficial()).isEqualTo("test");
  }

  @Test
  void shouldNotUpdateServicePointDesignationOfficial() {
    ServicePointVersion version1 = ServicePointVersion.builder()
        .id(1000L)
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 6, 1))
        .designationOfficial("Alt")
        .number(ServicePointNumber.ofNumberWithoutCheckDigit(1234567))
        .version(0)
        .build();

    ServicePointVersion updated = ServicePointVersion.builder()
        .id(1000L)
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 6, 1))
        .designationOfficial("test")
        .number(ServicePointNumber.ofNumberWithoutCheckDigit(1234567))
        .version(0)
        .build();

    UpdateDesignationOfficialServicePointModel updateDesignationOfficialServicePointModel =
        UpdateDesignationOfficialServicePointModel
            .builder()
            .designationOfficial("test")
            .build();

    when(servicePointVersionRepositoryMock.findById(1000L)).thenReturn(Optional.of(version1));
    when(servicePointVersionRepositoryMock.findAllByNumberOrderByValidFrom(
        ServicePointNumber.ofNumberWithoutCheckDigit(1234567))).thenReturn(List.of(version1), List.of(updated));

    assertThrows(IdNotFoundException.class,
        () -> servicePointService.updateDesignationOfficial(1L, updateDesignationOfficialServicePointModel));
  }
}
