import { TestBed } from '@angular/core/testing';

import { BranchService } from './branch.service';
import { HTTP } from '@ionic-native/http/ngx';

describe('BranchService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTP
    ]
  }));

  it('should be created', () => {
    const service: BranchService = TestBed.get(BranchService);
    expect(service).toBeTruthy();
  });
});
