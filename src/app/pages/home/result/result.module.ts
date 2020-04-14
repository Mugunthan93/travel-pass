import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { FlightBaggageComponent } from 'src/app/components/flight/flight-baggage/flight-baggage.component';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { LocationComponent } from 'src/app/components/hotel/location/location.component';
import { ViewHotelComponent } from 'src/app/components/hotel/view-hotel/view-hotel.component';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultPageRoutingModule
  ],
  declarations: [
    ResultPage,
    TripFilterComponent,
    FlightBaggageComponent,
    HotelFilterComponent,
    LocationComponent,
    ViewHotelComponent,
    AboutHotelComponent
  ],
  entryComponents: [
    TripFilterComponent,
    FlightBaggageComponent,
    HotelFilterComponent,
    LocationComponent,
    ViewHotelComponent,
    AboutHotelComponent
  ]
})
export class ResultPageModule {}
