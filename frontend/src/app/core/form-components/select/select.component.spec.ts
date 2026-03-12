import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SelectComponent } from './select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { AtlasLabelFieldComponent, InfoIconComponent } from '@atlas/form';
import { translateServiceProvider } from '../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';

describe('SelectComponent', () => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  let component: SelectComponent<any>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  let fixture: ComponentFixture<SelectComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        SelectComponent,
        InfoIconComponent,
        AtlasLabelFieldComponent,
      ],
      providers: [translateServiceProvider, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
