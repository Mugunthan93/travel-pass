import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { MatDividerModule } from '@angular/material/divider';
import { GuestRoomComponent } from 'src/app/components/guest-room/guest-room.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    HotelPageRoutingModule,
    SharedModule
  ],
  declarations: [
    HotelPage,
    GuestRoomComponent
  ],
  entryComponents: [
    GuestRoomComponent
  ]
})
export class HotelPageModule {}
