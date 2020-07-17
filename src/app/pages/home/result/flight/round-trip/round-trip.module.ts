import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoundTripPageRoutingModule } from './round-trip-routing.module';

import { RoundTripPage } from './round-trip.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoundTripPageRoutingModule,
    SharedModule,
    MatExpansionModule
  ],
  declarations: [
    RoundTripPage
  ]
})
export class RoundTripPageModule {}
