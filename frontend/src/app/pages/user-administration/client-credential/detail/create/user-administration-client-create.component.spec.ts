import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { UserAdministrationClientCreateComponent } from './user-administration-client-create.component';
import { NotificationService } from '../../../../../core/notification/notification.service';
import { TranslatePipe } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailPageContainerComponent } from '../../../../../core/components/detail-page-container/detail-page-container.component';
import { DetailFooterComponent } from '../../../../../core/components/detail-footer/detail-footer.component';
import { DetailPageContentComponent } from '../../../../../core/components/detail-page-content/detail-page-content.component';
import { ClientCredentialAdministrationService } from '../../../../../api/service/user-administration/client-credential-administration.service';
import { translateServiceProvider } from '../../../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { tickAsync } from '../../../../../../test/tick-async';

describe('UserAdministrationClientCreateComponent', () => {
  let component: UserAdministrationClientCreateComponent;
  let fixture: ComponentFixture<UserAdministrationClientCreateComponent>;

  let clientCredentialAdministrationService: Mocked<
    Pick<ClientCredentialAdministrationService, 'createClientCredential'>
  >;
  let notificationService: Mocked<Pick<NotificationService, 'success'>>;

  beforeEach(async () => {
    clientCredentialAdministrationService = {
      createClientCredential: vi.fn(),
    };
    notificationService = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        UserAdministrationClientCreateComponent,
        DetailPageContainerComponent,
        DetailPageContentComponent,
        DetailFooterComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        translateServiceProvider,
        {
          provide: ClientCredentialAdministrationService,
          useValue: clientCredentialAdministrationService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
        TranslatePipe,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { user: undefined },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {
              // mock implementation
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAdministrationClientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create client', async () => {
    const router = TestBed.inject(Router);
    component.form.controls.clientCredentialId.setValue('client-id');
    component.form.controls.alias.setValue('alias');

    clientCredentialAdministrationService.createClientCredential.mockReturnValue(
      of({
        clientCredentialId: 'client-id',
      })
    );
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.create();
    expect(
      clientCredentialAdministrationService.createClientCredential
    ).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    await tickAsync(1000);
    expect(notificationService.success).toHaveBeenCalledExactlyOnceWith(
      'USER_ADMIN.NOTIFICATIONS.ADD_SUCCESS'
    );
  });
});
