import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SloidContainerComponent } from './sloid-container.component';
import { translateServiceProvider } from '../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { inputBinding, signal } from '@angular/core';

describe('SloidContainer', () => {
  let component: SloidContainerComponent;
  let fixture: ComponentFixture<SloidContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SloidContainerComponent],
      providers: [translateServiceProvider, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SloidContainerComponent, {
      bindings: [inputBinding('sloid', signal('ch:1:sloid:12'))],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
