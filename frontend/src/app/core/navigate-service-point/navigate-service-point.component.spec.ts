import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateServicePointComponent } from './navigate-service-point.component';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { translateServiceProvider } from '../../app.testing.mocks';

describe('NavigateServicePoint', () => {
  let component: NavigateServicePointComponent;
  let fixture: ComponentFixture<NavigateServicePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigateServicePointComponent, RouterModule.forRoot([])],
      providers: [provideHttpClient(), translateServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigateServicePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
