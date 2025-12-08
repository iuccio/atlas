import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { AtlasButtonComponent } from '../../../../core/components/button/atlas-button.component';
import { AtlasLabelFieldComponent } from '@atlas/form';
import { CommentComponent } from '../../../../core/form-components/comment/comment.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { StatementDetailFormGroup } from '../statement-detail-form-group';

@Component({
  selector: 'atlas-statement-text',
  imports: [
    AtlasButtonComponent,
    AtlasLabelFieldComponent,
    CommentComponent,
    MatCheckbox,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './statement-text.html',
  providers: [TranslatePipe],
})
export class StatementText implements OnInit {
  ngOnInit(): void {
    this.setCheckboxStatementAnonymous =
      this.form().getRawValue().statementAnonymous!;

    this._currentAnonymousStatement =
      this.form().getRawValue().anonymousStatement!;

    if (this.form().getRawValue().anonymousStatement) {
      this.setAnonymizeStatementButtonActive = true;
      this.showOriginalStatementText = false;
      this.showOriginalTextButton = true;
    } else {
      this.setAnonymizeStatementButtonActive = false;
      this.showOriginalStatementText = true;
      this.showOriginalTextButton = false;
    }
  }

  form = input.required<FormGroup<StatementDetailFormGroup>>();
  isNew = input.required<boolean>();

  private _anonymizeStatementButtonActive = false;
  private _checkboxStatementAnonymous = false;
  private _showOriginalStatementText = false;
  private _showOriginalTextButton = false;
  private _originalTextButtonLabel = 'TTH.STATEMENT.SHOW_ORIGINAL_TEXT';
  private _originalTextButtonIcon = 'bi-lock-fill';
  private _currentAnonymousStatement!: string;

  get isCheckboxStatementAnonymous(): boolean {
    return this._checkboxStatementAnonymous;
  }

  set setCheckboxStatementAnonymous(value: boolean) {
    this._checkboxStatementAnonymous = value;
  }

  get isAnonymizeStatementButtonActive(): boolean {
    return this._anonymizeStatementButtonActive;
  }

  set setAnonymizeStatementButtonActive(value: boolean) {
    this._anonymizeStatementButtonActive = value;
  }

  get showOriginalStatementText(): boolean {
    return this._showOriginalStatementText;
  }

  set showOriginalStatementText(value: boolean) {
    this._showOriginalStatementText = value;
  }

  get originalTextButtonIcon(): string {
    return this._originalTextButtonIcon;
  }

  set originalTextButtonIcon(value: string) {
    this._originalTextButtonIcon = value;
  }

  get originalTextButtonLabel(): string {
    return this._originalTextButtonLabel;
  }

  set originalTextButtonLabel(value: string) {
    this._originalTextButtonLabel = value;
  }

  get showOriginalTextButton(): boolean {
    return this._showOriginalTextButton;
  }

  set showOriginalTextButton(value: boolean) {
    this._showOriginalTextButton = value;
  }

  checkStatementAnonymous(checked: boolean) {
    this.setCheckboxStatementAnonymous = checked;
    this.showOriginalStatementText = true;
    this.showOriginalTextButton = false;
    if (checked) {
      this._currentAnonymousStatement =
        this.form().controls.anonymousStatement.getRawValue()!;
      this.form().controls.anonymousStatement.setValue(null);
    } else {
      if (this._currentAnonymousStatement) {
        this.form().controls.anonymousStatement.setValue(
          this._currentAnonymousStatement
        );
      }
    }
  }

  anonymizeStatement() {
    this.setAnonymizeStatementButtonActive =
      !this.isAnonymizeStatementButtonActive;
    this.form().controls.anonymousStatement.setValue(
      this.form().controls.statement.value
    );
    this.form().markAsDirty();
  }

  showOriginalText() {
    this.showOriginalStatementText = !this.showOriginalStatementText;
    if (this.showOriginalStatementText) {
      this.originalTextButtonLabel = 'TTH.STATEMENT.HIDE_ORIGINAL_TEXT';
      this.originalTextButtonIcon = 'bi-lock';
    } else {
      this.originalTextButtonLabel = 'TTH.STATEMENT.SHOW_ORIGINAL_TEXT';
      this.originalTextButtonIcon = 'bi-lock-fill';
    }
  }
}
