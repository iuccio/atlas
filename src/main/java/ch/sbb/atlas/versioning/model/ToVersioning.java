package ch.sbb.atlas.versioning.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ToVersioning {

  private Versionable versionable;

  private Entity entity;

}
