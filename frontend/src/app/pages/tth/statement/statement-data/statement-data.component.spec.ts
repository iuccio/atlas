import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementDataComponent } from './statement-data.component';

describe('StatementData', () => {
  let component: StatementDataComponent;
  let fixture: ComponentFixture<StatementDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatementDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
