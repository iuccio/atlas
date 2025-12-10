package ch.sbb.atlas.user.administration.security.service;

import ch.sbb.atlas.api.model.BoMailAssociated;
import ch.sbb.atlas.service.UserService;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BoUserMailCheckService {

  public boolean isCurrentUserMailAssignedTo(BoMailAssociated boMail) {
    String preferredUsername = UserService.getPreferredUsername();
    boolean isAssignedToStatement = Objects.equals(boMail.getBoContactMail(), preferredUsername);
    log.info("{} is assigned to statement: {}", preferredUsername, isAssignedToStatement);
    return isAssignedToStatement;
  }

}
