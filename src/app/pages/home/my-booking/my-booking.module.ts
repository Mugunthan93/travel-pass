import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyBookingPageRoutingModule } from './my-booking-routing.module';

import { MyBookingPage } from './my-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyBookingPageRoutingModule
  ],
  declarations: [MyBookingPage]
})
export class MyBookingPageModule {}
