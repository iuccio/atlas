import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthOverviewBaseComponent } from './tth-overview-base.component';

describe('TthOverviewBaseComponent', () => {
  let component: TthOverviewBaseComponent;
  let fixture: ComponentFixture<TthOverviewBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TthOverviewBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TthOverviewBaseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
