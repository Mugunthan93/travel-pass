import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { FlightBaggageComponent } from 'src/app/components/flight/flight-baggage/flight-baggage.component';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { LocationComponent } from 'src/app/components/hotel/location/location.component';
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
    LocationComponent
  ],
  entryComponents: [
    TripFilterComponent,
    FlightBaggageComponent,
    HotelFilterComponent,
    LocationComponent
  ]
})
export class ResultPageModule {}
