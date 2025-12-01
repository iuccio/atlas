package ch.sbb.workflow.module.lidi.tth.mail;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import ch.sbb.workflow.mail.MailProducerService;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TthDossierNotificationServiceTest {

  private static final TthDossier DOSSIER = TthDossier.builder().boContactMail("urs@bernmobil.be")
      .dossierQuestions(List.of(TthDossierQuestion.builder().id(1L).question("Könnt ihr?").build()))
      .build();

  @Mock
  private MailProducerService mailProducerService;

  @InjectMocks
  private TthDossierNotificationService tthDossierNotificationService;

  @Test
  void shouldNotifyBoAboutNewQuestion() {
    tthDossierNotificationService.notifyBoAboutNewQuestion(DOSSIER);

    verify(mailProducerService).produceMailNotification(any());
  }

  @Test
  void shouldNotifyCantonAboutNewAnswer() {
    tthDossierNotificationService.notifyCantonAboutNewAnswer(DOSSIER);

    verify(mailProducerService).produceMailNotification(any());
  }
}