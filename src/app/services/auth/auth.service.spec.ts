import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HTTP } from '@ionic-native/http/ngx';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTP
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
