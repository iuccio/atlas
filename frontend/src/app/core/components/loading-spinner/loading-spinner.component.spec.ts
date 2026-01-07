import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    })
      .overrideComponent(LoadingSpinnerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create spinning logo', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingSpinnerDiv = fixture.debugElement.query(
      By.css('.loading-spinner')
    );
    expect(loadingSpinnerDiv).toBeTruthy();
  });

  it('should do nothing if not loading', () => {
    const loadingSpinnerDiv = fixture.debugElement.query(
      By.css('.loading-spinner')
    );
    expect(loadingSpinnerDiv).toBeFalsy();
  });
});
