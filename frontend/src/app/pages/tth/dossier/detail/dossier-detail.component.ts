import { Component, inject, model, OnInit } from '@angular/core';
import { DetailFormComponent } from '../../../../core/leave-guard/leave-dirty-form-guard.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TthDossier } from '../../../../api/model/tthDossier';
import { DetailPageContainerComponent } from '../../../../core/components/detail-page-container/detail-page-container.component';
import { DetailPageContentComponent } from '../../../../core/components/detail-page-content/detail-page-content.component';
import { ScrollToTopDirective } from '../../../../core/scroll-to-top/scroll-to-top.directive';
import { DetailFooterComponent } from '../../../../core/components/detail-footer/detail-footer.component';
import {
  DossierDetailFormGroup,
  DossierFormGroupBuilder,
} from './dossier-detail-form-group';
import { AtlasLabelFieldComponent } from '@atlas/form';
import { TextFieldComponent } from '../../../../core/form-components/text-field/text-field.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AtlasSpacerComponent } from '../../../../core/components/spacer/atlas-spacer.component';
import { AtlasButtonComponent } from '../../../../core/components/button/atlas-button.component';
import { DateComponent } from '../../../../core/form-components/date/date.component';
import { CommentComponent } from '../../../../core/form-components/comment/comment.component';
import {
  DetailDialogHelperService,
  DetailWithCancelEdit,
} from '../../../../core/detail/detail-dialog-helper.service';
import { ValidationService } from '../../../../core/validation/validation.service';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { catchError, EMPTY } from 'rxjs';
import { NotificationService } from '../../../../core/notification/notification.service';
import { toNumberArrayStrict } from '../../../../core/util/arrays';
import {
  SelectedStatements,
  StatementSelectComponent,
} from '../statement-select/statement-select.component';

@Component({
  selector: 'atlas-dossier-detail',
  imports: [
    DetailPageContainerComponent,
    DetailPageContentComponent,
    ScrollToTopDirective,
    DetailFooterComponent,
    AtlasLabelFieldComponent,
    TextFieldComponent,
    TranslatePipe,
    AtlasSpacerComponent,
    AtlasButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    DateComponent,
    CommentComponent,
    StatementSelectComponent,
  ],
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.scss'],
})
export class DossierDetailComponent
  implements DetailFormComponent, DetailWithCancelEdit, OnInit
{
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly detailHelperService = inject(DetailDialogHelperService);
  readonly dossierInternalService = inject(DossierInternalService);
  readonly notificationService = inject(NotificationService);

  form!: FormGroup<DossierDetailFormGroup>;
  isNew = false;

  private _selectedStatements!: SelectedStatements;

  get selectedStatements(): SelectedStatements {
    return this._selectedStatements;
  }

  set selectedStatements(value: SelectedStatements) {
    this._selectedStatements = value;
    this.form.controls.statementIds.setValue(value.statementIds);
    this.form.controls.swissCanton.setValue(value.swissCanton);
  }

  ngOnInit() {
    const dossier: TthDossier | undefined =
      this.activatedRoute.snapshot.data.dossier;
    this.form = DossierFormGroupBuilder.buildFormGroup(dossier);
    if (dossier) {
      this.isNew = false;
    } else {
      this.isNew = true;
      const statementIds: number[] = toNumberArrayStrict(
        this.activatedRoute.snapshot.queryParams?.statementIds
      );
      this.selectedStatements = { statementIds: statementIds };
    }
  }

  toggleEdit() {
    if (this.form.enabled) {
      this.detailHelperService.showCancelEditDialog(this);
    } else {
      this.form.enable();
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute }).then();
  }

  save() {
    ValidationService.validateForm(this.form);
    if (this.form.valid) {
      const dossier = DossierFormGroupBuilder.getDossier(
        this.form,
        this.selectedStatements
      );
      this.form.disable();
      if (this.isNew) {
        this.createDossier(dossier);
      } else {
        console.log('Dossier Update not implemented yet');
      }
    }
  }

  private createDossier(dossier: TthDossier) {
    this.dossierInternalService
      .createDossier(dossier)
      .pipe(catchError(this.handleError()))
      .subscribe((dossier) => {
        this.notificationService.success(
          'TTH.DOSSIER.NOTIFICATION.ADD_SUCCESS'
        );
        this.router
          .navigate(['..', dossier.id], { relativeTo: this.activatedRoute })
          .then(() => this.ngOnInit());
      });
  }

  private handleError() {
    return () => {
      this.form.enable();
      return EMPTY;
    };
  }
}
