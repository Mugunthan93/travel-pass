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
import { FlightSearchState } from '../stores/search/flight.state';
import { SharedState } from '../stores/shared.state';
import { ResultState } from '../stores/result.state';
import { FlightResultState } from '../stores/result/flight.state';
import { FilterState } from '../stores/result/filter.state';
import { BookState } from '../stores/book.state';
import { FLightBookState } from '../stores/book/flight.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      AuthState,
      UserState,
      DashboardState,
      SearchState,
      ResultState,
      BookState,
      FlightSearchState,
      FlightResultState,
      FLightBookState,
      FilterState,
      SharedState
    ], { developmentMode: !environment.production }
    ),
    NgxsStoragePluginModule.forRoot({
      key: [
        UserState,
        SearchState,
        SharedState,
        ResultState,
        FilterState,
        BookState
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
