import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementText } from './statement-text';

describe('StatementText', () => {
  let component: StatementText;
  let fixture: ComponentFixture<StatementText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
