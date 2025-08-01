import { Component, OnInit } from '@angular/core';
import {
  ApplicationType,
  BusinessOrganisationsService,
  BusinessOrganisationVersion,
  BusinessType,
} from '../../../../api';
import { BaseDetailController } from '../../../../core/components/base-detail/base-detail-controller';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationService } from '../../../../core/notification/notification.service';
import { DialogService } from '../../../../core/components/dialog/dialog.service';
import { catchError } from 'rxjs';
import moment from 'moment';
import { DateRangeValidator } from '../../../../core/validation/date-range/date-range-validator';
import { Pages } from '../../../pages';
import { Page } from 'src/app/core/model/page';
import { AtlasCharsetsValidator } from '../../../../core/validation/charsets/atlas-charsets-validator';
import { WhitespaceValidator } from '../../../../core/validation/whitespace/whitespace-validator';
import { AtlasFieldLengthValidator } from '../../../../core/validation/field-lengths/atlas-field-length-validator';
import { BusinessOrganisationDetailFormGroup } from './business-organisation-detail-form-group';
import { BusinessOrganisationLanguageService } from '../../../../core/form-components/bo-select/business-organisation-language.service';
import { ValidityService } from '../../../sepodi/validity/validity.service';
import { PermissionService } from '../../../../core/auth/permission/permission.service';
import { BaseDetailComponent } from '../../../../core/components/base-detail/base-detail.component';
import { NgIf } from '@angular/common';
import { TextFieldComponent } from '../../../../core/form-components/text-field/text-field.component';
import { DateRangeComponent } from '../../../../core/form-components/date-range/date-range.component';
import { SelectComponent } from '../../../../core/form-components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  templateUrl: './business-organisation-detail.component.html',
  styleUrls: ['./business-organisation-detail.component.scss'],
  providers: [ValidityService],
  imports: [
    BaseDetailComponent,
    ReactiveFormsModule,
    NgIf,
    TextFieldComponent,
    DateRangeComponent,
    SelectComponent,
    TranslatePipe,
  ],
})
export class BusinessOrganisationDetailComponent
  extends BaseDetailController<BusinessOrganisationVersion>
  implements OnInit
{
  BUSINESS_TYPES = Object.values(BusinessType);

  constructor(
    protected router: Router,
    private businessOrganisationsService: BusinessOrganisationsService,
    private businessOrganisationLanguageService: BusinessOrganisationLanguageService,
    protected notificationService: NotificationService,
    protected dialogService: DialogService,
    protected permissionService: PermissionService,
    protected activatedRoute: ActivatedRoute,
    protected validityService: ValidityService
  ) {
    super(
      router,
      dialogService,
      notificationService,
      permissionService,
      activatedRoute,
      validityService
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getPageType(): Page {
    return Pages.BUSINESS_ORGANISATIONS;
  }

  getApplicationType(): ApplicationType {
    return ApplicationType.Bodi;
  }

  readRecord(): BusinessOrganisationVersion {
    return this.activatedRoute.snapshot.data.businessOrganisationDetail;
  }

  getDetailHeading(record: BusinessOrganisationVersion): string {
    return `${record[this.displayedAbbreviation()] ?? ''} - ${record.organisationNumber ?? ''}`;
  }

  displayedAbbreviation() {
    return this.businessOrganisationLanguageService.getCurrentLanguageAbbreviation();
  }

  getDetailSubheading(record: BusinessOrganisationVersion): string {
    return record.sboid!;
  }

  updateRecord(): void {
    this.businessOrganisationsService
      .updateBusinessOrganisationVersion(this.getId(), this.form.value)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.notificationService.success(
          'BODI.BUSINESS_ORGANISATION.NOTIFICATION.EDIT_SUCCESS'
        );
        this.router
          .navigate([
            Pages.BODI.path,
            Pages.BUSINESS_ORGANISATIONS.path,
            this.record.sboid,
          ])
          .then(() => this.ngOnInit());
      });
  }

  createRecord(): void {
    this.form.disable();
    this.businessOrganisationsService
      .createBusinessOrganisationVersion(this.form.value)
      .pipe(catchError(this.handleError))
      .subscribe((version) => {
        this.notificationService.success(
          'BODI.BUSINESS_ORGANISATION.NOTIFICATION.ADD_SUCCESS'
        );
        this.router
          .navigate([
            Pages.BODI.path,
            Pages.BUSINESS_ORGANISATIONS.path,
            version.sboid,
          ])
          .then(() => this.ngOnInit());
      });
  }

  revokeRecord(): void {
    const selectedRecord = this.getSelectedRecord();
    if (selectedRecord.sboid) {
      this.businessOrganisationsService
        .revokeBusinessOrganisation(selectedRecord.sboid)
        .subscribe(() => {
          this.notificationService.success(
            'BODI.BUSINESS_ORGANISATION.NOTIFICATION.REVOKE_SUCCESS'
          );
          this.router
            .navigate([
              Pages.BODI.path,
              Pages.BUSINESS_ORGANISATIONS.path,
              selectedRecord.sboid,
            ])
            .then(() => this.ngOnInit());
        });
    }
  }

  deleteRecord(): void {
    const selectedVersion: BusinessOrganisationVersion =
      this.getSelectedRecord();
    if (selectedVersion.sboid != null) {
      this.businessOrganisationsService
        .deleteBusinessOrganisation(selectedVersion.sboid)
        .subscribe(() => {
          this.notificationService.success(
            'BODI.BUSINESS_ORGANISATION.NOTIFICATION.DELETE_SUCCESS'
          );
          this.backToOverview();
        });
    }
  }

  getFormGroup(version: BusinessOrganisationVersion): FormGroup {
    return new FormGroup<BusinessOrganisationDetailFormGroup>(
      {
        descriptionDe: new FormControl(version.descriptionDe, [
          Validators.required,
          AtlasFieldLengthValidator.length_60,
          WhitespaceValidator.blankOrEmptySpaceSurrounding,
          AtlasCharsetsValidator.iso88591,
        ]),
        descriptionFr: new FormControl(version.descriptionFr, [
          Validators.required,
          AtlasFieldLengthValidator.length_60,
          WhitespaceValidator.blankOrEmptySpaceSurrounding,
          AtlasCharsetsValidator.iso88591,
        ]),
        descriptionIt: new FormControl(version.descriptionIt, [
          Validators.required,
          AtlasFieldLengthValidator.length_60,
          WhitespaceValidator.blankOrEmptySpaceSurrounding,
          AtlasCharsetsValidator.iso88591,
        ]),
        descriptionEn: new FormControl(version.descriptionEn, [
          Validators.required,
          AtlasFieldLengthValidator.length_60,
          WhitespaceValidator.blankOrEmptySpaceSurrounding,
          AtlasCharsetsValidator.iso88591,
        ]),
        abbreviationDe: new FormControl(version.abbreviationDe, [
          Validators.required,
          AtlasFieldLengthValidator.length_10,
          AtlasCharsetsValidator.iso88591,
        ]),
        abbreviationFr: new FormControl(version.abbreviationFr, [
          Validators.required,
          AtlasFieldLengthValidator.length_10,
          AtlasCharsetsValidator.iso88591,
        ]),
        abbreviationIt: new FormControl(version.abbreviationIt, [
          Validators.required,
          AtlasFieldLengthValidator.length_10,
          AtlasCharsetsValidator.iso88591,
        ]),
        abbreviationEn: new FormControl(version.abbreviationEn, [
          Validators.required,
          AtlasFieldLengthValidator.length_10,
          AtlasCharsetsValidator.iso88591,
        ]),
        organisationNumber: new FormControl(version.organisationNumber, [
          Validators.required,
          AtlasCharsetsValidator.numeric,
          Validators.min(0),
          Validators.max(99999),
        ]),
        contactEnterpriseEmail: new FormControl(
          version.contactEnterpriseEmail,
          [AtlasFieldLengthValidator.length_255, AtlasCharsetsValidator.email]
        ),
        businessTypes: new FormControl(version.businessTypes),
        validFrom: new FormControl(
          version.validFrom ? moment(version.validFrom) : version.validFrom,
          [Validators.required]
        ),
        validTo: new FormControl(
          version.validTo ? moment(version.validTo) : version.validTo,
          [Validators.required]
        ),
        etagVersion: new FormControl(version.etagVersion),
        creationDate: new FormControl(version.creationDate),
        editionDate: new FormControl(version.editionDate),
        editor: new FormControl(version.editor),
        creator: new FormControl(version.creator),
      },
      [DateRangeValidator.fromGreaterThenTo('validFrom', 'validTo')]
    );
  }
}
