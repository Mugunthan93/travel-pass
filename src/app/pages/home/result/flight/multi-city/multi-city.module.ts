import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiCityPageRoutingModule } from './multi-city-routing.module';

import { MultiCityPage } from './multi-city.page';
import { ResultListComponent } from 'src/app/components/result-list/result-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlightBaggageComponent } from 'src/app/components/flight-baggage/flight-baggage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiCityPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    MultiCityPage,
    ResultListComponent
  ]
})
export class MultiCityPageModule {}
