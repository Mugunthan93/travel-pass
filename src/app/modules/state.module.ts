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
import { DashboardState } from '../stores/dashboard.state';
import { SearchState } from '../stores/search.state';
import { FLightState } from '../stores/search/flight.state';
import { OneWayState } from '../stores/search/flight/oneway.state';
import { RoundTripState } from '../stores/search/flight/roundtrip.state';
import { MultiCityState } from '../stores/search/flight/multicity.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      AuthState,
      UserState,
      DashboardState,
      SearchState,
      FLightState,
      OneWayState,
      RoundTripState,
      MultiCityState
    ], { developmentMode: !environment.production }
    ),
    NgxsStoragePluginModule.forRoot({
      key: [
        AuthState,
        UserState,
        DashboardState,
        SearchState,
        FLightState,
        OneWayState,
        RoundTripState,
        MultiCityState
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
