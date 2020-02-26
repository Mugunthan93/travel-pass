import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { BookingPageComponent } from 'src/app/components/booking-page/booking-page.component';
import { BookingTypeComponent } from 'src/app/components/booking-type/booking-type.component';
import { BookingWayComponent } from 'src/app/components/booking-way/booking-way.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage,
    BookingPageComponent,
    BookingTypeComponent,
    BookingWayComponent
  ]
})
export class SearchPageModule { }
