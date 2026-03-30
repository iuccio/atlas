import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoadingSpinnerService } from './loading-spinner.service';
import { provideRouter } from '@angular/router';

describe('LoadingSpinnerService', () => {
  let service: LoadingSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    service = TestBed.inject(LoadingSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
