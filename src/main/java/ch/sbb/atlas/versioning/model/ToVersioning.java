package ch.sbb.atlas.versioning.model;

import ch.sbb.atlas.versioning.exception.VersioningException;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ToVersioning {

  private Versionable versionable;

  private Entity entity;

  public LocalDate getValidFrom() {
    if (this.versionable == null) {
      throw new VersioningException("Versionable object is null.");
    }
    return this.versionable.getValidFrom();
  }

  public LocalDate getValidTo() {
    if (this.versionable == null) {
      throw new VersioningException("Versionable object is null.");
    }
    return this.versionable.getValidTo();
  }

}
