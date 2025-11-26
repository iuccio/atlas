package ch.sbb.atlas.revoke.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.model.exception.Sid4ptNotFoundException;
import ch.sbb.atlas.revoke.Revokable;
import ch.sbb.atlas.revoke.exception.TerminationNotAllowedWhenVersionInReview;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

class RevokeServiceTest {

  @Test
  void shouldRevoke() {
    //given
    RevokeService<ObjectRevokable> revokeServiceSpy = spy(ObjectRevokableService.class);
    ObjectRevokable objectRevokable1 = ObjectRevokable.builder()
        .status(Status.VALIDATED)
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 12, 31))
        .build();
    ObjectRevokable objectRevokable2 = ObjectRevokable.builder()
        .status(Status.VALIDATED)
        .validFrom(LocalDate.of(2001, 1, 1))
        .validTo(LocalDate.of(2003, 12, 31))
        .build();
    doReturn(List.of(objectRevokable1, objectRevokable2)).when(revokeServiceSpy).findBySid4ptOrderByValidFrom("ch:1:sloid:1234");
    //when
    List<ObjectRevokable> result = revokeServiceSpy.revoke("ch:1:sloid:1234");
    //then
    assertThat(result).hasSize(2);
    assertThat(result).extracting(ObjectRevokable::getStatus).containsOnly(Status.REVOKED);
    ObjectRevokable lastVersion = result.getLast();
    assertThat(lastVersion.getValidTo()).isEqualTo(lastVersion.getValidFrom());
  }

  @Test
  void shouldNotRevokeWhenNoVersionWasFound() {
    //given
    RevokeService<ObjectRevokable> revokeServiceSpy = spy(ObjectRevokableService.class);
    doReturn(List.of()).when(revokeServiceSpy).findBySid4ptOrderByValidFrom("ch:1:sloid:1234");

    //when && then
    assertThrows(Sid4ptNotFoundException.class, () -> revokeServiceSpy.revoke("ch:1:sloid:1234"));
  }

  @Test
  void shouldNotRevokeWhenInReview() {
    //given
    RevokeService<ObjectRevokable> revokeServiceSpy = spy(ObjectRevokableService.class);
    ObjectRevokable objectRevokable1 = ObjectRevokable.builder()
        .status(Status.IN_REVIEW)
        .validFrom(LocalDate.of(2000, 1, 1))
        .validTo(LocalDate.of(2000, 12, 31))
        .build();
    doReturn(List.of(objectRevokable1)).when(revokeServiceSpy).findBySid4ptOrderByValidFrom("ch:1:sloid:1234");

    //when && then
    assertThrows(TerminationNotAllowedWhenVersionInReview.class, () -> revokeServiceSpy.revoke("ch:1:sloid:1234"));
  }

  @Builder
  @Getter
  @Setter
  static class ObjectRevokable implements Revokable {

    private LocalDate validFrom;

    private LocalDate validTo;

    private Status status;
  }

  @Slf4j
  static class ObjectRevokableService extends RevokeService<ObjectRevokable> {

    @Override
    protected List<ObjectRevokable> findBySid4ptOrderByValidFrom(String sloid) {
      return List.of();
    }

    @Override
    protected void saveAll(List<ObjectRevokable> versionRevokables) {
      log.debug("Saving objects revokables");
    }
  }

}