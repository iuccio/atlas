import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MaintenanceIconComponent } from './maintenance-icon.component';

describe('MaintenanceIconComponent', () => {
  let component: MaintenanceIconComponent;
  let fixture: ComponentFixture<MaintenanceIconComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
