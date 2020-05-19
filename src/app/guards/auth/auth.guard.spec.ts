import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from 'src/app/stores/auth.state';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([
          AuthState
        ], { developmentMode: !environment.production }
        )
      ],
      providers: [
        AuthGuard,
        HTTP
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
