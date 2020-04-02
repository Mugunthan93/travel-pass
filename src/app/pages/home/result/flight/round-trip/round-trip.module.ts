import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoundTripPageRoutingModule } from './round-trip-routing.module';

import { RoundTripPage } from './round-trip.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoundTripPageRoutingModule,
    SharedModule
  ],
  declarations: [
    RoundTripPage
  ]
})
export class RoundTripPageModule {}
