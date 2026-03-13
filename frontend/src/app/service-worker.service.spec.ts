import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceWorkerService } from './service-worker.service';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './core/components/dialog/dialog.component';
import { of, Subject } from 'rxjs';
import { mock } from 'vitest-mock-extended';

describe('ServiceWorkerService', () => {
  let service: ServiceWorkerService;

  const matDialogSpy = mock<MatDialog>();
  const matDialogRefSpy = mock<MatDialogRef<DialogComponent>>();
  matDialogSpy.open.mockReturnValue(matDialogRefSpy);

  class SwUpdateMock {
    versionUpdates = new Subject<{ type: string }>();
    unrecoverable = new Subject<void>();
    isEnabled = true;
    checkForUpdate = () => Promise.resolve(false);
  }

  let swUpdateMock: SwUpdateMock;

  beforeEach(() => {
    swUpdateMock = new SwUpdateMock();

    TestBed.configureTestingModule({
      providers: [
        ServiceWorkerService,
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    });

    service = TestBed.inject(ServiceWorkerService);

    vi.spyOn(service, 'openSWDialog');
    vi.spyOn(service, 'reloadPage').mockImplementation(() => {});
    matDialogSpy.open.mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog on versionUpdate event and reload page', () => {
    matDialogRefSpy.afterClosed.mockReturnValue(of(true));
    swUpdateMock.versionUpdates.next({
      type: 'VERSION_READY',
    });
    expect(service['openSWDialog']).toHaveBeenCalledExactlyOnceWith(
      'SW_DIALOG.UPDATE_TITLE',
      'SW_DIALOG.UPDATE_MESSAGE'
    );
    expect(matDialogSpy.open).toHaveBeenCalledExactlyOnceWith(DialogComponent, {
      data: {
        confirmText: 'DIALOG.RELOAD',
        title: 'SW_DIALOG.UPDATE_TITLE',
        message: 'SW_DIALOG.UPDATE_MESSAGE',
        link: {
          url: 'https://atlas-info.app.sbb.ch/static/atlas-release-notes.html',
          textLink: 'Release Notes',
          text: 'SW_DIALOG.NEW_RELEASE_TEXT',
        },
      },
      panelClass: 'atlas-dialog-panel',
      backdropClass: 'atlas-dialog-backdrop',
    });
    expect(service.reloadPage).toHaveBeenCalledExactlyOnceWith();
  });

  it('should not open dialog on versionUpdate event', () => {
    swUpdateMock.versionUpdates.next({
      type: 'VERSION_DETECTED',
    });
    expect(matDialogSpy.open).not.toHaveBeenCalled();
  });

  it('should open dialog on unrecoverable event', () => {
    matDialogRefSpy.afterClosed.mockReturnValue(of(false));
    swUpdateMock.unrecoverable.next();
    expect(service['openSWDialog']).toHaveBeenCalledExactlyOnceWith(
      'SW_DIALOG.UNRECOVERABLE_TITLE',
      'SW_DIALOG.UNRECOVERABLE_MESSAGE'
    );
    expect(matDialogSpy.open).toHaveBeenCalledExactlyOnceWith(DialogComponent, {
      data: {
        confirmText: 'DIALOG.RELOAD',
        title: 'SW_DIALOG.UNRECOVERABLE_TITLE',
        message: 'SW_DIALOG.UNRECOVERABLE_MESSAGE',
        link: {
          url: 'https://atlas-info.app.sbb.ch/static/atlas-release-notes.html',
          textLink: 'Release Notes',
          text: 'SW_DIALOG.NEW_RELEASE_TEXT',
        },
      },
      panelClass: 'atlas-dialog-panel',
      backdropClass: 'atlas-dialog-backdrop',
    });
    expect(service.reloadPage).not.toHaveBeenCalled();
  });
});
