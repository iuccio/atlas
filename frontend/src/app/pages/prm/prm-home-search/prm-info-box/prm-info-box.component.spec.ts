import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrmInfoBoxComponent } from './prm-info-box.component';
import { AppTestingModule } from '../../../../app.testing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PrmInfoBoxComponent', () => {
  let component: PrmInfoBoxComponent;
  let fixture: ComponentFixture<PrmInfoBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, PrmInfoBoxComponent],
      providers: [{ provide: TranslatePipe }],
    });

    fixture = TestBed.createComponent(PrmInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 5 links', () => {
    expect(fixture.debugElement.queryAll(By.css('a')).length).toEqual(5);
  });
});
