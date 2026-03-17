import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectComponent } from './select.component';
import { translateServiceProvider } from '../../../app.testing.mocks';

describe('SelectComponent', () => {
  let component: SelectComponent<unknown>;
  let fixture: ComponentFixture<SelectComponent<unknown>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [translateServiceProvider],
    });

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
