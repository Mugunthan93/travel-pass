import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightPageRoutingModule } from './flight-routing.module';

import { FlightPage } from './flight.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightPageRoutingModule,
    MatExpansionModule,
    SharedModule
  ],
  declarations: [
    FlightPage
  ]
})
export class FlightPageModule {}
