import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { BookingPageComponent } from 'src/app/components/booking-page/booking-page.component';
import { BookingTypeComponent } from 'src/app/components/booking-type/booking-type.component';
import { BookingWayComponent } from 'src/app/components/booking-way/booking-way.component';
import { SearchPage } from './search/search.page';
import { ResultPage } from './result/result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingPageRoutingModule
  ],
  declarations: 
  [
    BookingPage,
    SearchPage,
    ResultPage,
    BookingPageComponent,
    BookingTypeComponent,
    BookingWayComponent,
    CityModalComponent
  ],
  entryComponents :[CityModalComponent]
})
export class BookingPageModule {}
