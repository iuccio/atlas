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
    boolean isAssignedToStatement = isCurrentUserMailAssignedTo(boMail.getBoContactMail());
    log.info("{} is assigned to statement: {}", boMail.getBoContactMail(), isAssignedToStatement);
    return isAssignedToStatement;
  }

  public boolean isCurrentUserMailAssignedTo(String boMail) {
    String preferredUsername = UserService.getPreferredUsername();
    return Objects.equals(boMail, preferredUsername);
  }

}
