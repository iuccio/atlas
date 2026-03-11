import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SloidContainerComponent } from './sloid-container.component';
import { translateServiceProvider } from '../../app.testing.mocks';
import { inputBinding, signal } from '@angular/core';

describe('SloidContainer', () => {
  let component: SloidContainerComponent;
  let fixture: ComponentFixture<SloidContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [translateServiceProvider],
    });

    const sloidInputName: keyof SloidContainerComponent = 'sloid';
    fixture = TestBed.createComponent(SloidContainerComponent, {
      bindings: [inputBinding(sloidInputName, signal('ch:1:sloid:12'))],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
