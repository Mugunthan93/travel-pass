import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from 'src/app/stores/auth.state';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage ],
      imports: [
        IonicModule.forRoot(),
        NgxsModule.forRoot([
          AuthState
        ], { developmentMode: !environment.production }
        )
      ],
      providers: [
        HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
