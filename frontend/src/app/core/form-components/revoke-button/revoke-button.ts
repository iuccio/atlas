import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DialogService } from '../../components/dialog/dialog.service';
import { Observable } from 'rxjs';
import { AtlasButtonComponent } from '../../components/button/atlas-button.component';

export interface Revokable {
  revoke: () => void;
}

@Component({
  selector: 'app-revoke-button',
  imports: [AtlasButtonComponent],
  templateUrl: './revoke-button.html',
})
export class RevokeButton {
  @Output() revokeClicked = new EventEmitter<Observable<void>>();
  private readonly dialogService = inject(DialogService);

  revoke() {
    this.dialogService
      .confirm({
        title: 'DIALOG.WARNING',
        message: 'DIALOG.REVOKE',
        cancelText: 'DIALOG.BACK',
        confirmText: 'DIALOG.CONFIRM_REVOKE',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.revokeClicked.emit();
        }
      });
  }
}
