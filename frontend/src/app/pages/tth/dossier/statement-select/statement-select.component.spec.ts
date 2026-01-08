import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementSelectComponent } from './statement-select.component';
import { ActivatedRoute } from '@angular/router';

describe('StatementSelectComponent', () => {
  let component: StatementSelectComponent;
  let fixture: ComponentFixture<StatementSelectComponent>;

  const activatedRoute = {
    snapshot: {
      data: {
        dossier: undefined,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementSelectComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatementSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
