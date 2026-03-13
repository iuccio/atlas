import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { authServiceMock } from './app.testing.mocks';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: SwUpdate,
          useValue: {},
        },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should serialize date correctly', () => {
    const result = new Date('2029-06-01').toISOString();
    expect(result).toBe('2029-06-01');
  });
});
