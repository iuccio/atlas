import { inject, Injectable } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TimetableHearingStatementInternalService } from '../../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { forkJoin } from 'rxjs';

export interface DossierMailData {
  topic: string;
  statementIds: number[];
  question: string | null | undefined;
  answer: string | null | undefined;
  internalComment: string | null | undefined;
  publicComment: string | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class OpenDossierInMailService {
  private readonly translatePipe = inject(TranslatePipe);
  private readonly timetableHearingStatementInternalService = inject(
    TimetableHearingStatementInternalService
  );

  openDossierInMailClient(dossierMailData: DossierMailData) {
    forkJoin(
      dossierMailData.statementIds.map((id) =>
        this.timetableHearingStatementInternalService.getStatement(id)
      )
    ).subscribe((statements) => {
      const topicInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.TOPIC',
        dossierMailData.topic
      );
      const questionInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.BO_QUESTION',
        dossierMailData.question
      );
      const answerInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.BO_ANSWER',
        dossierMailData.answer
      );
      const internalCommentInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.INTERNAL_COMMENT',
        dossierMailData.internalComment
      );
      const publicCommentInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.PUBLIC_COMMENT',
        dossierMailData.publicComment
      );
      const statementInfo = this.buildInfoWithLabel(
        'TTH.DOSSIER.STATEMENTS',
        statements
          .map((i) => {
            const anonymizedStatement = i.statementAnonymous
              ? i.statement
              : (i.anonymousStatement ?? '');
            return `[${i.id}]: ${anonymizedStatement}`;
          })
          .join('\n\n')
      );

      const subject = dossierMailData.topic;
      const body = `${topicInfo}${questionInfo}${answerInfo}${internalCommentInfo}${publicCommentInfo}${statementInfo}`;
      const link = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(link, '_self');
    });
  }

  private buildInfoWithLabel(label: string, value: string | null | undefined) {
    if (value) {
      return this.translatePipe.transform(label) + ':\n' + value + '\n\n';
    }
    return '';
  }
}
