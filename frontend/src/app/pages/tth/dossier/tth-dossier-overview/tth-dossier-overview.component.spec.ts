import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthDossierOverviewComponent } from './tth-dossier-overview.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTestingModule } from '../../../../app.testing.module';

describe('TthDossierOverviewComponent', () => {
  let component: TthDossierOverviewComponent;
  let fixture: ComponentFixture<TthDossierOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TthDossierOverviewComponent, AppTestingModule],
      providers: [{ provide: TranslatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(TthDossierOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
