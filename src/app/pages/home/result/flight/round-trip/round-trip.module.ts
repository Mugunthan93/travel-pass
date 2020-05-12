import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoundTripPageRoutingModule } from './round-trip-routing.module';

import { RoundTripPage } from './round-trip.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoundTripPageRoutingModule,
    SharedModule
  ],
  declarations: [
    RoundTripPage,
    ResultSortingComponent
  ]
})
export class RoundTripPageModule {}
