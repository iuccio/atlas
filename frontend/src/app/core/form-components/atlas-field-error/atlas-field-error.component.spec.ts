import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { AtlasFieldErrorComponent } from './atlas-field-error.component';
import { FormControl } from '@angular/forms';

describe('AtlasFieldErrorComponent', () => {
  let component: AtlasFieldErrorComponent;
  let fixture: ComponentFixture<AtlasFieldErrorComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasFieldErrorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
