import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoStatementDetailComponent } from './bo-statement-detail.component';

describe('BoStatementDetail', () => {
  let component: BoStatementDetailComponent;
  let fixture: ComponentFixture<BoStatementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoStatementDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoStatementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
