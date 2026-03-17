import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TextFieldComponent } from './text-field.component';
import { FormControl, FormGroup } from '@angular/forms';
import { translateServiceProvider } from '../../../app.testing.mocks';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [translateServiceProvider],
    });

    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      number: new FormControl('ch:slnid:12345'),
    });
    component.controlName = 'number';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
