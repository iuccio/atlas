import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SearchSelectComponent } from './search-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtlasFieldErrorComponent } from '../atlas-field-error/atlas-field-error.component';
import { translateServiceProvider } from '../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { mock } from 'vitest-mock-extended';
import { NgSelectComponent } from '@ng-select/ng-select';

describe('SearchSelectComponent', () => {
  let component: SearchSelectComponent<unknown>;
  let fixture: ComponentFixture<SearchSelectComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        SearchSelectComponent,
        AtlasFieldErrorComponent,
      ],
      providers: [translateServiceProvider, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      testControl: new FormControl(null),
    });
    component.controlName = 'testControl';

    fixture.detectChanges();
  });

  it('isDropdownOpen should return false', () => {
    const ngSelectMock = mock<NgSelectComponent>();
    Object.defineProperty(ngSelectMock, 'isOpen', { value: signal(undefined) });
    component.ngSelect = ngSelectMock;
    expect(component.isDropdownOpen()).toBe(false);
  });

  it('isDropdownOpen should return true', () => {
    const ngSelectMock = mock<NgSelectComponent>();
    Object.defineProperty(ngSelectMock, 'isOpen', { value: signal(true) });
    component.ngSelect = ngSelectMock;
    expect(component.isDropdownOpen()).toBe(true);
  });
});
