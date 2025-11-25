package ch.sbb.atlas.revoke;

import ch.sbb.atlas.model.Status;
import java.time.LocalDate;

public interface Revokable {

  void setStatus(Status status);

  Status getStatus();

  void setValidTo(LocalDate validTo);

  LocalDate getValidFrom();

}
