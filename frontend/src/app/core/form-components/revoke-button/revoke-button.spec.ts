import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeButton } from './revoke-button';
import { translateServiceProvider } from '../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { DialogService } from '../../components/dialog/dialog.service';
import { of } from 'rxjs';
import { ApplicationType } from '../../../api';

const dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
  confirm: of(true),
});

describe('RevokeButton', () => {
  let component: RevokeButton;
  let fixture: ComponentFixture<RevokeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevokeButton],
      providers: [
        translateServiceProvider,
        provideHttpClient(),
        { provide: DialogService, useValue: dialogService },
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
    spyOn(component.revokeClicked, 'emit');
    //when
    component.revoke();
    //then
    expect(dialogService.confirm).toHaveBeenCalled();
    expect(component.revokeClicked.emit).toHaveBeenCalled();
  });
});
