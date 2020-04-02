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
import { SearchState } from 'src/app/stores/search.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      AppState,
      SearchState
    ], { developmentMode: !environment.production }
    ),
    NgxsStoragePluginModule.forRoot({
      key: [
        'App',
        'App.user.id',
        'App.user',
        'search'
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
