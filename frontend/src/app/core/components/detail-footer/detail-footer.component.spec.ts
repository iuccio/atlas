import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DetailFooterComponent } from './detail-footer.component';

describe('DetailFooterComponent', () => {
  let component: DetailFooterComponent;
  let fixture: ComponentFixture<DetailFooterComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
