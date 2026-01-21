import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierSelectComponent } from './dossier-select.component';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchSelectComponent } from '../../../../../core/form-components/search-select/search-select.component';
import { DossierInternalService } from '../../../../../api/service/workflow/dossier-internal.service';
import { ContainerTthDossier } from '../../../../../api/model/containerTthDossier';
import { SwissCanton } from '../../../../../api';
import { DossierStatus } from '../../../../../api/model/dossierStatus';

@Component({
  selector: 'atlas-form-search-select',
  template: '<p>form-search-select</p>',
})
class MockFormSearchSelectComponent {
  @Input() items$ = of([]);
  @Input() formGroup = undefined;
  @Input() controlName = '';
  @Input() bindValueInp = '';
  @Input() getSelectOption = undefined;
}

describe('DossierSelectComponent', () => {
  let component: DossierSelectComponent;
  let fixture: ComponentFixture<DossierSelectComponent>;

  const dossierInternalService = jasmine.createSpyObj(
    'DossierInternalService',
    ['getOverview']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierSelectComponent],
      providers: [
        TranslatePipe,
        {
          provide: DossierInternalService,
          useValue: dossierInternalService,
        },
      ],
    })
      .overrideComponent(DossierSelectComponent, {
        remove: { imports: [SearchSelectComponent] },
        add: { imports: [MockFormSearchSelectComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DossierSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('canton', SwissCanton.Bern);
    fixture.componentRef.setInput('statusRestriction', [DossierStatus.Added]);
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        dossier: new FormControl(),
      })
    );
    fixture.detectChanges();
  });

  it('should search for dossier', (done) => {
    const searchResult: ContainerTthDossier = {
      objects: [
        {
          id: 1,
          topic: 'Dossier 1',
          swissCanton: SwissCanton.Bern,
          statementIds: [],
          questions: [],
        },
      ],
    };
    dossierInternalService.getOverview.and.returnValue(of(searchResult));

    component.search('testQuery');
    fixture.detectChanges();
    expect(dossierInternalService.getOverview).toHaveBeenCalledOnceWith(
      SwissCanton.Bern,
      ['testQuery'],
      [DossierStatus.Added]
    );
    component.searchResults$.subscribe((val) => {
      expect(val).toEqual(searchResult.objects!);
      done();
    });
  });
});
