import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DialogCloseComponent } from './dialog-close.component';

describe('DialogCloseComponent', () => {
  let component: DialogCloseComponent;
  let fixture: ComponentFixture<DialogCloseComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
