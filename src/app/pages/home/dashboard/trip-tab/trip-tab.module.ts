import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripTabPageRoutingModule } from './trip-tab-routing.module';

import { TripTabPage } from './trip-tab.page';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    TripTabPageRoutingModule
  ],
  declarations: [TripTabPage]
})
export class TripTabPageModule {}
