import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AtlasSpacerComponent } from './atlas-spacer.component';

describe('AtlasSpacerComponent', () => {
  let component: AtlasSpacerComponent;
  let fixture: ComponentFixture<AtlasSpacerComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
