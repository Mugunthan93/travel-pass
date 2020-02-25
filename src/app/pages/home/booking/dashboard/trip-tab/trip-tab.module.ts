import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripTabPageRoutingModule } from './trip-tab-routing.module';

import { TripTabPage } from './trip-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripTabPageRoutingModule
  ],
  declarations: [TripTabPage]
})
export class TripTabPageModule {}
