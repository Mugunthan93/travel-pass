import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoundTripPageRoutingModule } from './round-trip-routing.module';

import { RoundTripPage } from './round-trip.page';
import { ResultListComponent } from 'src/app/components/result-list/result-list.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoundTripPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    RoundTripPage,
    ResultListComponent
  ]
})
export class RoundTripPageModule {}
