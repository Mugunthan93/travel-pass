import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../stores/auth.state';
import { environment } from 'src/environments/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from '../stores/user.state';
import { CompanyService } from '../services/company/company.service';
import { CompanyState } from '../stores/company.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      AuthState,
      UserState,
      CompanyState
    ], { developmentMode: !environment.production }
    ),
    NgxsStoragePluginModule.forRoot({
      key: [
        UserState,
        CompanyState
      ]
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: false,
      collapsed: true
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'Auth',
      disabled: true
    })
  ]
})
  
export class StateModule { }
