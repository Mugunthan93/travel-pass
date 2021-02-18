import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';
import { HTTP } from '@ionic-native/http/ngx';

describe('CompanyService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTP
    ]
  }));

  it('should be created', () => {
    const service: CompanyService = TestBed.get(CompanyService);
    expect(service).toBeTruthy();
  });
});
