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
import { CompanyState } from '../stores/company.state';
import { OneWaySearchState } from '../stores/search/flight/oneway.state';
import { RoundTripSearchState } from '../stores/search/flight/round-trip.state';
import { MultiCitySearchState } from '../stores/search/flight/multi-city.state';
import { OneWayResultState } from '../stores/result/flight/oneway.state';
import { DomesticResultState } from '../stores/result/flight/domestic.state';
import { InternationalResultState } from '../stores/result/flight/international.state';
import { MultiCityResultState } from '../stores/result/flight/multi-city.state';
import { OneWayBookState } from '../stores/book/flight/oneway.state';
import { BookingState } from '../stores/booking.state';
import { ApprovalState } from '../stores/approval.state';
import { DomesticBookState } from '../stores/book/flight/domestic.state';
import { MultiCityBookState } from '../stores/book/flight/multi-city.state';
import { InternationalBookState } from '../stores/book/flight/international.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { HotelSearchState } from '../stores/search/hotel.state';
import { HotelResultState } from '../stores/result/hotel.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([

      AuthState,
      UserState,
      CompanyState,
      DashboardState,
      SearchState,
      ResultState,
      BookState,

      //lvl 2
      FlightSearchState,
      FlightResultState,
      FLightBookState,

      OneWaySearchState,
      RoundTripSearchState,
      MultiCitySearchState,
      
      OneWayResultState,
      DomesticResultState,
      InternationalResultState,
      MultiCityResultState,
      
      OneWayBookState,
      DomesticBookState,
      InternationalBookState,
      MultiCityBookState,

      HotelSearchState,
      HotelResultState,

      BookingState,
      ApprovalState,
      
      FilterState,
      SharedState
    ], { developmentMode: !environment.production }
    ),
    NgxsResetPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: [
        UserState,
        CompanyState,

        SearchState,
        ResultState,
        BookState,

        BookingState,
        ApprovalState,
        
        FilterState,
        SharedState,
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
