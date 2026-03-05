import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import {
  adminUserServiceMock,
  authServiceMock,
  translateServiceProvider,
} from '../../../app.testing.mocks';
import { UserService } from '../../auth/user/user.service';
import { provideHttpClient } from '@angular/common/http';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        translateServiceProvider,
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: adminUserServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    component.init();
  });

  describe('Component Rendering', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render username on the title', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button').title).toContain(
        'Test'
      );
    });

    it('should logout', () => {
      // Open user menu
      fixture.detectChanges();
      const usermenuOpenButton = fixture.debugElement.query(By.css('button'));
      usermenuOpenButton.nativeElement.click();

      // Logout
      const logoutButton = fixture.debugElement.query(By.css('#logout'));
      logoutButton.nativeElement.click();

      expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should login', () => {
      component.isLoggedIn = false;
      fixture.detectChanges();

      // Login
      const loginButton = fixture.debugElement.query(By.css('#login'));
      loginButton.nativeElement.click();

      expect(authServiceMock.login).toHaveBeenCalled();
    });
  });

  describe('Component logic', () => {
    it('should extract username', () => {
      //when
      component.extractUserName();

      //then
      expect(component.userName).toBe('Test');
    });

    it('should return null when name is null', () => {
      //given
      component.user = undefined;
      //when
      component.extractUserName();

      //then
      expect(component.userName).toBeUndefined();
    });

    it('should return user name if no (', () => {
      //when
      const result = component.removeDepartment(
        'ATLAS / LIDI / FPFN Admin User'
      );

      //then
      expect(result).toBe('ATLAS / LIDI / FPFN Admin User');
    });

    it('should return part before (', () => {
      //when
      const result = component.removeDepartment(
        'Lastname Firstname (TEST-DEP)'
      );

      //then
      expect(result).toBe('Lastname Firstname');
    });
  });
});
