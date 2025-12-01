package ch.sbb.atlas.model.exception;

public class Sid4ptNotFoundException extends NotFoundException {

  public Sid4ptNotFoundException(String sid4pt) {
    super("sid4pt", sid4pt);
  }
}


