import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthDossierOverviewMenuComponent } from './tth-dossier-overview-menu.component';

describe('TthDossierOverviewMenuComponent', () => {
  let component: TthDossierOverviewMenuComponent;
  let fixture: ComponentFixture<TthDossierOverviewMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TthDossierOverviewMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TthDossierOverviewMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
