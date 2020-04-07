import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoundTripPageRoutingModule } from './round-trip-routing.module';

import { RoundTripPage } from './round-trip.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { FairSummaryComponent } from 'src/app/components/fair-summary/fair-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RoundTripPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    RoundTripPage,
    FairSummaryComponent
  ]
})
export class RoundTripPageModule {}
