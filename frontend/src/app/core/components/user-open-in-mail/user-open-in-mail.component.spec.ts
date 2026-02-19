import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpenInMailComponent } from './user-open-in-mail.component';
import { inputBinding, signal } from '@angular/core';
import { ApplicationType, Permission, User } from '../../../api';
import { of } from 'rxjs';
import { UserAdministrationService } from '../../../api/service/user-administration/user-administration.service';

describe('UserOpenInMailComponent', () => {
  let component: UserOpenInMailComponent;
  let fixture: ComponentFixture<UserOpenInMailComponent>;

  const user: User = {
    permissions: new Set<Permission>(),
    sbbUserId: '',
    userId: 'e123456',
    displayName: 'Marek Hamsik',
    mail: 'asd@as.ch',
  };

  const userAdminServiceMock = {
    getUser() {
      return of(user);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOpenInMailComponent],
      providers: [
        { provide: UserAdministrationService, useValue: userAdminServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOpenInMailComponent, {
      bindings: [
        inputBinding('applicationType', signal(ApplicationType.Prm)),
        inputBinding('userId', signal('e123456')),
      ],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    //given
    spyOn(window, 'open');
    //when
    component.openInMail();
    //then
    expect(window.open).toHaveBeenCalled();
  });
});
