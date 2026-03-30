import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { By } from '@angular/platform-browser';
import { translateServiceProvider } from '../../../app.testing.mocks';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        translateServiceProvider,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Title', message: 'message' },
        },
        { provide: MatDialogRef, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with title and text', () => {
    expect(component).toBeTruthy();

    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toBe('Title');

    const content = fixture.debugElement.query(By.css('mat-dialog-content'));
    expect(content.nativeElement.textContent).toBe('message');
  });
});
