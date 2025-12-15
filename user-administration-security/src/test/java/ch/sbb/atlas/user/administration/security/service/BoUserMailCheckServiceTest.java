package ch.sbb.atlas.user.administration.security.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.model.BoMailAssociated;
import ch.sbb.atlas.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

class BoUserMailCheckServiceTest {

  private MockedStatic<UserService> userServiceMock;

  private BoUserMailCheckService boUserMailCheckService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    boUserMailCheckService = new BoUserMailCheckService();
    userServiceMock = Mockito.mockStatic(UserService.class);

  }

  @AfterEach
  void tearDown() {
    userServiceMock.close();
  }

  @Test
  void shouldReturnTrueWhenMailsAreMatching() {
    //given
    BoMailAssociated boMail = mock(BoMailAssociated.class);
    userServiceMock.when(UserService::getPreferredUsername).thenReturn("user@yb.com");
    when(boMail.getBoContactMail()).thenReturn("user@yb.com");

    //when
    boolean result = boUserMailCheckService.isCurrentUserMailAssignedTo(boMail);

    //then
    assertThat(result).isTrue();
    userServiceMock.verify(UserService::getPreferredUsername, times(1));

  }

  @Test
  void shouldReturnFalseWhenMailsAreNotMatching() {
    //given
    BoMailAssociated boMail = mock(BoMailAssociated.class);
    userServiceMock.when(UserService::getPreferredUsername).thenReturn("fc@zueri.com");
    when(boMail.getBoContactMail()).thenReturn("user@yb.com");
    //when
    boolean result = boUserMailCheckService.isCurrentUserMailAssignedTo(boMail);
    //then
    assertThat(result).isFalse();
    userServiceMock.verify(UserService::getPreferredUsername, times(1));

  }
}
