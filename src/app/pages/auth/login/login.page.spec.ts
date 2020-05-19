import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from 'src/app/stores/auth.state';
import { environment } from 'src/environments/environment';

describe('LoginPage', () => {


  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPage
      ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        NgxsModule.forRoot([
          AuthState
        ], { developmentMode: !environment.production }
        )
      ],
      providers: [
        HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
