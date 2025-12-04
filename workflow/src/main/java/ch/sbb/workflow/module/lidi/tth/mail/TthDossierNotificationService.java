package ch.sbb.workflow.module.lidi.tth.mail;

import ch.sbb.atlas.kafka.model.mail.MailNotification;
import ch.sbb.atlas.kafka.model.mail.MailType;
import ch.sbb.workflow.mail.MailProducerService;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TthDossierNotificationService {

  private final MailProducerService mailProducerService;

  public void notifyBoAboutNewQuestion(TthDossier dossier) {
    // Send actual Mail with ATLAS-3232
    MailNotification mailNotification = MailNotification.builder()
        .to(List.of(dossier.getBoContactMail()))
        .subject(dossier.getTopic())
        .mailType(MailType.ATLAS_STANDARD)
        .build();
    mailProducerService.produceMailNotification(mailNotification);
  }

  public void notifyCantonAboutNewAnswer(TthDossier dossier) {
    // Send actual Mail with ATLAS-3232
    MailNotification mailNotification = MailNotification.builder()
        .to(List.of()) // Dossier editor mail vom UserAdministration via Azure lesen
        .content(dossier.getDossierQuestions().getFirst().getQuestion())
        .subject(dossier.getTopic())
        .mailType(MailType.ATLAS_STANDARD)
        .build();
    mailProducerService.produceMailNotification(mailNotification);
  }

}
