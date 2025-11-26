package ch.sbb.workflow.module.lidi.tth.mail;

import ch.sbb.atlas.kafka.model.mail.MailNotification;
import ch.sbb.workflow.mail.MailProducerService;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TthDossierNotificationService {

  private final MailProducerService mailProducerService;

  public void notifyBoAboutNewQuestion(TthDossierQuestion question) {
    // Send actual Mail with ATLAS-3232
    MailNotification mailNotification = MailNotification.builder()
        .to(List.of(question.getTthDossier().getBoContactMail()))
        .build();
    mailProducerService.produceMailNotification(mailNotification);
  }

  public void notifyCantonAboutNewAnswer(TthDossierQuestion question) {
    // Send actual Mail with ATLAS-3232
    MailNotification mailNotification = MailNotification.builder()
        .to(List.of()) // Dossier editor mail vom UserAdministration via Azure lesen
        .content(question.getQuestion())
        .build();
    mailProducerService.produceMailNotification(mailNotification);
  }

}
