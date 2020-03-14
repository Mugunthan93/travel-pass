import { TestBed } from '@angular/core/testing';

import { BrowserHttpService } from './browser-http.service';

describe('BrowserHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrowserHttpService = TestBed.get(BrowserHttpService);
    expect(service).toBeTruthy();
  });
});
