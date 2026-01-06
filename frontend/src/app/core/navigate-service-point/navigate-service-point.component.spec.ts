import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateServicePointComponent } from './navigate-service-point.component';

describe('NavigateServicePoint', () => {
  let component: NavigateServicePointComponent;
  let fixture: ComponentFixture<NavigateServicePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigateServicePointComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigateServicePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
