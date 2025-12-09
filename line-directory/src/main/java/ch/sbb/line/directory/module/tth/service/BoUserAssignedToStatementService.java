package ch.sbb.line.directory.module.tth.service;

import ch.sbb.atlas.service.UserService;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingStatement;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BoUserAssignedToStatementService {

  public boolean isAssigned(TimetableHearingStatement statement) {
    String preferredUsername = UserService.getPreferredUsername();
    boolean isAssignedToStatement = Objects.equals(statement.getDossierContactMail(), preferredUsername);
    log.info("{} is assigned to statement: {}", preferredUsername, isAssignedToStatement);
    return isAssignedToStatement;
  }

}
