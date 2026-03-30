import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DetailPageContentComponent } from './detail-page-content.component';

describe('DetailPageContainerComponent', () => {
  let component: DetailPageContentComponent;
  let fixture: ComponentFixture<DetailPageContentComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
