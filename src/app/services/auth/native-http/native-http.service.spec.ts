import { TestBed } from '@angular/core/testing';

import { NativeHttpService } from './native-http.service';

describe('NativeHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeHttpService = TestBed.get(NativeHttpService);
    expect(service).toBeTruthy();
  });
});
