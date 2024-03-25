import { TestBed } from '@angular/core/testing';

import { AppStartService } from './app-start.service';

describe('AppStartService', () => {
  let service: AppStartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
