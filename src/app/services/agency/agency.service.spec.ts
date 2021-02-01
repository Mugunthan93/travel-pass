import { TestBed } from '@angular/core/testing';

import { AgencyService } from './agency.service';

describe('AgencyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgencyService = TestBed.get(AgencyService);
    expect(service).toBeTruthy();
  });
});
