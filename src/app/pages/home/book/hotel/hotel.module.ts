import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelPageRoutingModule } from './hotel-routing.module';

import { HotelPage } from './hotel.page';
import { MatDividerModule } from '@angular/material/divider';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HotelPageRoutingModule,
    MatExpansionModule,
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
