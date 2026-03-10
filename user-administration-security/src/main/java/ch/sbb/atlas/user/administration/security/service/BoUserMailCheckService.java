package ch.sbb.atlas.user.administration.security.service;

import ch.sbb.atlas.api.model.BoContactAssociated;
import ch.sbb.atlas.service.UserService;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BoUserMailCheckService {

  public boolean isCurrentUserMailAssignedTo(BoContactAssociated boContactAssociated) {
    boolean isMailAssigned = isCurrentUserMailAssignedTo(boContactAssociated.getBoContactMail());

    String userIdentifier = UserService.getUserIdentifier();
    boolean isSbbuidAssigned = Objects.equals(userIdentifier, boContactAssociated.getBoContactSbbuid());
    log.info("{} is assigned to boContactAssociated object: {}", userIdentifier, isSbbuidAssigned);
    return isMailAssigned || isSbbuidAssigned;
  }

  public boolean isCurrentUserMailAssignedTo(String boMail) {
    String preferredUsername = UserService.getPreferredUsername();
    log.info("{} is equal to boMail: {}", preferredUsername, boMail);
    return Objects.equals(boMail, preferredUsername);
  }

}
