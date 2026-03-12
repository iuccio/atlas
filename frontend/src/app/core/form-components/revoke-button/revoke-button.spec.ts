import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi, type Mocked } from 'vitest';

import { RevokeButton } from './revoke-button';
import { translateServiceProvider } from '../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { DialogService } from '../../components/dialog/dialog.service';
import { of } from 'rxjs';
import { ApplicationType } from '../../../api';

describe('RevokeButton', () => {
  let component: RevokeButton;
  let fixture: ComponentFixture<RevokeButton>;
  let dialogServiceMock: Mocked<Pick<DialogService, 'confirm'>>;

  beforeEach(async () => {
    dialogServiceMock = {
      confirm: vi.fn().mockReturnValue(of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [RevokeButton],
      providers: [
        translateServiceProvider,
        provideHttpClient(),
        { provide: DialogService, useValue: dialogServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RevokeButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('applicationType', ApplicationType.Bodi);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should revoke', () => {
    //given
    vi.spyOn(component.revokeClicked, 'emit');
    //when
    component.revoke();
    //then
    expect(dialogServiceMock.confirm).toHaveBeenCalled();
    expect(component.revokeClicked.emit).toHaveBeenCalled();
  });
});
