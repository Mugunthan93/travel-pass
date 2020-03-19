import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AppState } from 'src/app/stores/app.state';
import { environment } from 'src/environments/environment';
import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { CustomStorage } from 'src/app/stores/custom-storage';
import { Platform } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([AppState], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: [
        'App',
        'App.user.id',
        'App.user'
      ]
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: false,
      collapsed: true
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'App',
      disabled: true
    })
  ]
})
export class StateManagementModule { }
