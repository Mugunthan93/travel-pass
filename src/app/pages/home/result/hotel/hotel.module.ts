import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ViewHotelComponent } from 'src/app/components/hotel/view-hotel/view-hotel.component';
import { ViewRoomComponent } from 'src/app/components/hotel/view-room/view-room.component';
import { SimilarHotelsComponent } from 'src/app/components/hotel/similar-hotels/similar-hotels.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelPageRoutingModule,
    SharedModule,
    PipeModule,
    MatGridListModule,
    MatDividerModule
  ],
  declarations: [
    HotelPage,
    ViewHotelComponent,
    ViewRoomComponent,
    SimilarHotelsComponent
  ],
  entryComponents: [
    ViewHotelComponent,
    ViewRoomComponent
  ]
})
export class HotelPageModule {}
