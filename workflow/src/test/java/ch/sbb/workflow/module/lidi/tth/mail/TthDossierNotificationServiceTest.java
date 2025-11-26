package ch.sbb.workflow.module.lidi.tth.mail;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import ch.sbb.workflow.mail.MailProducerService;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TthDossierNotificationServiceTest {

  @Mock
  private MailProducerService mailProducerService;

  @InjectMocks
  private TthDossierNotificationService tthDossierNotificationService;

  @Test
  void shouldNotifyBoAboutNewQuestion() {
    TthDossierQuestion question =
        TthDossierQuestion.builder().tthDossier(TthDossier.builder().boContactMail("urs@bernmobil.be").build()).build();
    tthDossierNotificationService.notifyBoAboutNewQuestion(question);

    verify(mailProducerService).produceMailNotification(any());
  }

  @Test
  void shouldNotifyCantonAboutNewAnswer() {
    TthDossierQuestion question =
        TthDossierQuestion.builder().tthDossier(TthDossier.builder().boContactMail("urs@bernmobil.be").build()).build();
    tthDossierNotificationService.notifyCantonAboutNewAnswer(question);

    verify(mailProducerService).produceMailNotification(any());
  }
}