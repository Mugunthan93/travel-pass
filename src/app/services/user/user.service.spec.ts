import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HTTP } from '@ionic-native/http/ngx';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTP
    ]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
