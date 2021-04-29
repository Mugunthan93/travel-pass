import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../stores/auth.state';
import { environment } from 'src/environments/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
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
import { SortState } from '../stores/result/sort.state';
import { HotelBookState } from '../stores/book/hotel.state';
import { BusSearchState } from '../stores/search/bus.state';
import { BusResultState } from '../stores/result/bus.state';
import { BusBookState } from '../stores/book/bus.state';
import { PassengerState } from '../stores/passenger.state';
import { FlightPassengerState } from '../stores/passenger/flight.passenger.states';
import { HotelPassengerState } from '../stores/passenger/hotel.passenger.state';
import { BusPassengerState } from '../stores/passenger/bus.passenger.state';
import { FlightFilterState } from '../stores/result/filter/flight.filter.state';
import { DepartureFilterState } from '../stores/result/filter/departure.filter.state';
import { ReturnFilterState } from '../stores/result/filter/return.filter.state';
import { HotelFilterState } from '../stores/result/filter/hotel.filter.state';
import { EligibilityState } from '../stores/eligibility.state';
import { TrainSearchState } from '../stores/search/train.state';
import { TrainOneWaySearchState } from '../stores/search/train/oneway.state';
import { TrainRoundTripSearchState } from '../stores/search/train/round-trip.state';
import { TrainMultiCitySearchState } from '../stores/search/train/multi-city.state';
import { TrainPassengerState } from '../stores/passenger/train.passenger.state';
import { TrainBookState } from '../stores/book/train.state';
import { TrainOneWayBookState } from '../stores/book/train/one-way.state';
import { TrainMultiCityBookState } from '../stores/book/train/multi-city.state';
import { TrainRoundTripBookState } from '../stores/book/train/round-trip.state';
import { BusFilterState } from '../stores/result/filter/bus.filter.state';
import { BookConfirmationComponent } from '../components/shared/book-confirmation/book-confirmation.component';
import { IonicModule } from '@ionic/angular';
import { ThemeState } from '../stores/theme.stata';
import { ExpenseState } from '../stores/expense.state';
import { AgencyState } from '../stores/agency.state';
import { VendorState } from '../stores/vendor.state';
import { CabSearchState } from '../stores/search/cab.state';
import { CabPassengerState } from '../stores/passenger/cab.passenger.state';
import { Params, RouterStateSnapshot } from '@angular/router';

export const stateArray = [
      UserState,
      CompanyState,
      AgencyState,
      VendorState,
      DashboardState,
      SearchState,
      ResultState,
      BookState,

      BookingState,
      ApprovalState,

      ThemeState,
      ExpenseState,

      SortState,
      SharedState,
      EligibilityState,

      PassengerState,
      FlightPassengerState,
      HotelPassengerState,
      BusPassengerState,
      CabPassengerState,

      TrainPassengerState,

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
      HotelBookState,

      BusSearchState,
      BusResultState,
      BusBookState,

      TrainSearchState,

      TrainOneWaySearchState,
      TrainRoundTripSearchState,
      TrainMultiCitySearchState,

      TrainBookState,

      TrainOneWayBookState,
      TrainRoundTripBookState,
      TrainMultiCityBookState,

      FilterState,
      FlightFilterState,
      DepartureFilterState,
      ReturnFilterState,
      HotelFilterState,
      BusFilterState,

      CabSearchState
];

export interface RouterStateParams {
  url: string;
  params: Params;
  queryParams: Params;
}

// Map the router snapshot to { url, params, queryParams }
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateParams> {
  serialize(routerState: RouterStateSnapshot): RouterStateParams {
    const {
      url,
      root: { queryParams }
    } = routerState;

    let { root: route } = routerState;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { params } = route;

    return { url, params, queryParams };
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgxsModule.forRoot([AuthState,...stateArray], { developmentMode: !environment.production }
    ),
    NgxsResetPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: [AuthState,...stateArray]
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({
      disabled: false,
      collapsed: true,
    })
  ],
  declarations: [BookConfirmationComponent],
  entryComponents: [BookConfirmationComponent],
  providers : [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ]
})
export class StateModule {}
