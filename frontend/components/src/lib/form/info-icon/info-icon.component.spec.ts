import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoIconComponent } from '@atlas/form';
import { beforeEach, describe, expect, it } from 'vitest';

describe('InfoIconComponent', () => {
  let component: InfoIconComponent;
  let fixture: ComponentFixture<InfoIconComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
