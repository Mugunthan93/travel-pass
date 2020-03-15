import { TestBed } from '@angular/core/testing';

import { HttpProvidersService } from './http-providers.service';

describe('HttpProvidersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpProvidersService = TestBed.get(HttpProvidersService);
    expect(service).toBeTruthy();
  });
});
