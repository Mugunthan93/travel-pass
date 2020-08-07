import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { FlightBaggageComponent } from 'src/app/components/flight/flight-baggage/flight-baggage.component';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { LocationComponent } from 'src/app/components/hotel/location/location.component';
import { HotelLocationComponent } from 'src/app/components/hotel/hotel-location/hotel-location.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';
import { FairRuleComponent } from 'src/app/components/flight/fair-rule/fair-rule.component';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';
import { PipeModule } from 'src/app/modules/pipe.module';
import { FlightDetailsComponent } from 'src/app/components/flight/flight-details/flight-details.component';
import { SelectedFlightComponent } from 'src/app/components/flight/selected-flight/selected-flight.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SeatSelectComponent } from 'src/app/components/bus/seat-select/seat-select.component';
import { PickDropPointComponent } from 'src/app/components/bus/pick-drop-point/pick-drop-point.component';
import { BusReviewComponent } from 'src/app/components/bus/bus-review/bus-review.component';
import { BusPhotoComponent } from 'src/app/components/bus/bus-photo/bus-photo.component';
import { BusAmentiesComponent } from 'src/app/components/bus/bus-amenties/bus-amenties.component';
import { BusPolicyComponent } from 'src/app/components/bus/bus-policy/bus-policy.component';
import { BusSeatlayoutComponent } from 'src/app/components/bus/bus-seatlayout/bus-seatlayout.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResultPageRoutingModule,
    MatExpansionModule,
    PipeModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: environment.map_js_key
    })
  ],
  declarations: [
    ResultPage,
    TripFilterComponent,
    FlightBaggageComponent,
    HotelFilterComponent,
    LocationComponent,
    HotelLocationComponent,
    BusFilterComponent,
    FairRuleComponent,
    EmailItineraryComponent,
    ResultSortingComponent,
    FlightDetailsComponent,
    SelectedFlightComponent,

    SeatSelectComponent,
    PickDropPointComponent,

    BusReviewComponent,
    BusPhotoComponent,
    BusAmentiesComponent,
    BusPolicyComponent,
    BusSeatlayoutComponent
  ],
  entryComponents: [
    TripFilterComponent,
    FlightBaggageComponent,
    HotelFilterComponent,
    LocationComponent,
    HotelLocationComponent,
    BusFilterComponent,
    FairRuleComponent,
    EmailItineraryComponent,
    ResultSortingComponent,
    FlightDetailsComponent,
    SelectedFlightComponent,

    SeatSelectComponent,
    PickDropPointComponent,

    BusReviewComponent,
    BusPhotoComponent,
    BusAmentiesComponent,
    BusPolicyComponent,
    BusSeatlayoutComponent
  ]
})
export class ResultPageModule {}
