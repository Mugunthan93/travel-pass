import { TestBed } from '@angular/core/testing';

import { NativeHttpService } from './native-http.service';
import { HTTP } from '@ionic-native/http/ngx';

describe('NativeHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTP
    ]
  }));

  it('should be created', () => {
    const service: NativeHttpService = TestBed.get(NativeHttpService);
    expect(service).toBeTruthy();
  });
});
