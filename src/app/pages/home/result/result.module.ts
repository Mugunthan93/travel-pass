import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { TripFilterComponent } from 'src/app/components/trip-filter/trip-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultPageRoutingModule
  ],
  declarations: [
    ResultPage,
    TripFilterComponent
  ],
  entryComponents: [
    TripFilterComponent
  ]
})
export class ResultPageModule {}
