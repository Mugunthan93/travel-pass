import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelPageRoutingModule,
    SharedModule
  ],
  declarations: [HotelPage]
})
export class HotelPageModule {}
