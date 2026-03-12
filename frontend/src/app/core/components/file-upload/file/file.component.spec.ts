import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileComponent } from './file.component';
import { By } from '@angular/platform-browser';

describe('FileComponent', () => {
  let component: FileComponent;
  let fixture: ComponentFixture<FileComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FileComponent);
    component = fixture.componentInstance;
    component.file = {
      name: 'filename.pdf',
      size: 10,
      type: 'application/pdf',
    } as File;
    component.downloadEnabled = true;
    component.deleteEnabled = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger delete', () => {
    const trashIcon = fixture.debugElement.query(By.css('.bi-trash'));
    expect(trashIcon).toBeTruthy();

    vi.spyOn(component.fileDeleted, 'emit').mockImplementation(() => {});

    trashIcon.nativeElement.click();
    expect(component.fileDeleted.emit).toHaveBeenCalled();
  });

  it('should trigger download', () => {
    const downloadIcon = fixture.debugElement.query(By.css('.bi-download'));
    expect(downloadIcon).toBeTruthy();

    vi.spyOn(component.downloadFile, 'emit').mockImplementation(() => {});

    downloadIcon.nativeElement.click();
    expect(component.downloadFile.emit).toHaveBeenCalled();
  });
});
