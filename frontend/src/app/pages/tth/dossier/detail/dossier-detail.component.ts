import { Component, inject, OnInit } from '@angular/core';
import { DetailFormComponent } from '../../../../core/leave-guard/leave-dirty-form-guard.service';
import { FormGroup } from '@angular/forms';
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

@Component({
  selector: 'atlas-dossier-detail',
  imports: [
    DetailPageContainerComponent,
    DetailPageContentComponent,
    ScrollToTopDirective,
    DetailFooterComponent,
  ],
  templateUrl: './dossier-detail.component.html',
})
export class DossierDetailComponent implements DetailFormComponent, OnInit {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  form!: FormGroup<DossierDetailFormGroup>;
  isNew = false;

  ngOnInit() {
    const dossier: TthDossier | undefined =
      this.activatedRoute.snapshot.data.dossier;
    this.form = DossierFormGroupBuilder.buildFormGroup(dossier);
    if (dossier) {
      this.isNew = false;
    } else {
      this.isNew = true;
      const statementIds: number[] =
        this.activatedRoute.snapshot.queryParams?.statementIds ?? [];
      console.log('Creating new dossier with statement IDs:', statementIds);
    }
  }
}
