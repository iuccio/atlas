import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../../../core/notification/notification.service';
import { UserPermissionManager } from '../../../service/user-permission-manager';
import {
  BusinessOrganisationsService,
  ClientCredential,
  ClientCredentialPermissionCreate,
  Permission,
} from '../../../../../api';
import { UserService } from '../../../service/user.service';
import { DialogService } from '../../../../../core/components/dialog/dialog.service';
import { CreationEditionRecord } from '../../../../../core/components/base-detail/user-edit-info/creation-edition-record';
import { ReadOnlyData } from '../../../components/read-only-data/read-only-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToTopDirective } from '../../../../../core/scroll-to-top/scroll-to-top.directive';
import { DetailPageContainerComponent } from '../../../../../core/components/detail-page-container/detail-page-container.component';
import { DetailPageContentComponent } from '../../../../../core/components/detail-page-content/detail-page-content.component';
import { UserAdministrationReadOnlyDataComponent } from '../../../components/read-only-data/user-administration-read-only-data.component';
import { NgFor, NgIf } from '@angular/common';
import { UserAdministrationApplicationConfigComponent } from '../../../components/application-config/user-administration-application-config.component';
import { UserDetailInfoComponent } from '../../../../../core/components/base-detail/user-edit-info/user-detail-info.component';
import { DetailFooterComponent } from '../../../../../core/components/detail-footer/detail-footer.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-client-credential-administration-edit',
  templateUrl: './user-administration-client-edit.component.html',
  viewProviders: [BusinessOrganisationsService, UserPermissionManager],
  imports: [
    ScrollToTopDirective,
    DetailPageContainerComponent,
    DetailPageContentComponent,
    UserAdministrationReadOnlyDataComponent,
    NgFor,
    UserAdministrationApplicationConfigComponent,
    UserDetailInfoComponent,
    DetailFooterComponent,
    NgIf,
    TranslatePipe,
  ],
})
export class UserAdministrationClientEditComponent implements OnInit {
  @Input() client!: ClientCredential;
  editMode = false;
  saveEnabled = true;
  record!: CreationEditionRecord;

  readonly readOnlyConfig: ReadOnlyData<ClientCredential>[][] = [
    [
      {
        translationKey: 'USER_ADMIN.CLIENT_CREDENTIAL.CLIENT_ID',
        value: 'clientCredentialId',
      },
      { translationKey: 'USER_ADMIN.CLIENT_CREDENTIAL.ALIAS', value: 'alias' },
    ],
  ];

  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly dialogService: DialogService,
    readonly userPermissionManager: UserPermissionManager,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const permissionsFromUserModelAsArray =
      this.userService.getPermissionsFromUserModelAsArray(this.client);
    this.userPermissionManager.setPermissions(permissionsFromUserModelAsArray);
    this.convertPermissionToRecord(permissionsFromUserModelAsArray);
  }

  saveEdits(): void {
    this.saveEnabled = false;
    this.userPermissionManager.emitBoFormResetEvent();
    this.userPermissionManager.clearPermisRestrIfNotWriterAndRemoveBOPermisRestrIfSepodiAndSuperUser();
    const managedPermissions = this.userPermissionManager.userPermission;
    const permissions = {
      ...this.client,
      ...managedPermissions,
    } as ClientCredentialPermissionCreate;
    this.userService.updateClientPermissions(permissions).subscribe({
      next: (client: ClientCredential) => {
        this.client = client;
        this.editMode = false;
        this.userPermissionManager.setPermissions(
          this.userService.getPermissionsFromUserModelAsArray(this.client)
        );
        this.notificationService.success(
          'USER_ADMIN.NOTIFICATIONS.EDIT_SUCCESS'
        );
      },
      error: () => (this.saveEnabled = true),
    });
  }

  cancelEdit(showDialog = true): void {
    if (!showDialog) {
      this.back();
      return;
    }
    this.dialogService.confirmLeave().subscribe((result) => {
      if (result) {
        this.editMode = false;
        this.userPermissionManager.setPermissions(
          this.userService.getPermissionsFromUserModelAsArray(this.client!)
        );
        this.userPermissionManager.emitBoFormResetEvent();
      }
    });
  }

  private convertPermissionToRecord(permissions: Permission[]): void {
    if (permissions.length > 0) {
      this.record = {
        editor: permissions[0].editor,
        editionDate: permissions[0].editionDate,
        creator: permissions[0].creator,
        creationDate: permissions[0].creationDate,
      };
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route }).then();
  }
}
