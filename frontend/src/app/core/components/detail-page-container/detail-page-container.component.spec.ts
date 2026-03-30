import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DetailPageContainerComponent } from './detail-page-container.component';

describe('DetailPageContainerComponent', () => {
  let component: DetailPageContainerComponent;
  let fixture: ComponentFixture<DetailPageContainerComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
