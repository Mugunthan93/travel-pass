import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { MatDividerModule } from '@angular/material/divider';
import { GuestRoomComponent } from 'src/app/components/hotel/guest-room/guest-room.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatDividerModule,
    HotelPageRoutingModule,
    SharedModule
  ],
  declarations: [
    HotelPage,
    GuestRoomComponent,
    SelectModalComponent
  ],
  entryComponents: [
    GuestRoomComponent,
    SelectModalComponent
  ]
})
export class HotelPageModule {}
