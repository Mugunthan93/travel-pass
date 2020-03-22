import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightPageRoutingModule } from './flight-routing.module';

import { FlightPage } from './flight.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResultListComponent } from 'src/app/components/result-list/result-list.component';
import { OneWayPage } from './one-way/one-way.page';
import { RoundTripPage } from './round-trip/round-trip.page';
import { MultiCityPage } from './multi-city/multi-city.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    FlightPage,
    OneWayPage,
    RoundTripPage,
    MultiCityPage,
    ResultListComponent
  ]
})
export class FlightPageModule {}
