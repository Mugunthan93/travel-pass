import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { MatDividerModule } from '@angular/material/divider';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelPageRoutingModule,
    MatDividerModule
  ],
  declarations: [
    HotelPage,
    BookConfirmationComponent
  ],
  entryComponents: [
    BookConfirmationComponent
  ]
})
export class HotelPageModule {}
