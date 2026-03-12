import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { translateServiceProvider } from '../../../app.testing.mocks';
import { DialogService } from './dialog.service';
import { of } from 'rxjs';
import { DialogData } from './dialog.data';

describe('DialogService', () => {
  let service: DialogService;

  const dialogData: DialogData = {
    title: 'Question',
    message: 'Do you want to be a rockstar?',
  };

  let dialogStub: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    // Mocking
    dialogStub = { open: vi.fn() };

    // Config
    TestBed.configureTestingModule({
      providers: [
        translateServiceProvider,
        { provide: MatDialog, useValue: dialogStub },
      ],
    });

    // Arrangement
    service = TestBed.inject(DialogService);
  });

  it('should open confirmation dialog and pass success value - true', () => {
    dialogStub.open.mockReturnValue({ afterClosed: () => of(true) } as any);

    service
      .confirm(dialogData)
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogStub.open).toHaveBeenCalled();
  });

  it('should open confirmation dialog and pass cancel value - false', () => {
    dialogStub.open.mockReturnValue({ afterClosed: () => of(false) } as any);

    service
      .confirm(dialogData)
      .subscribe((result) => expect(result).toBe(false));

    expect(dialogStub.open).toHaveBeenCalled();
  });

  it('should open info dialog and pass cancel value - false', () => {
    dialogData.isInfo = true;
    dialogStub.open.mockReturnValue({ afterClosed: () => of(false) } as any);

    service
      .showInfo(dialogData)
      .subscribe((result) => expect(result).toBe(false));

    expect(dialogStub.open).toHaveBeenCalled();
  });
});
