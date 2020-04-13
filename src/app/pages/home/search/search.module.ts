import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'ion2-calendar';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { CalendarModalComponent } from 'src/app/components/shared/calendar-modal/calendar-modal.component';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchPageRoutingModule,
    CalendarModule
  ],
  declarations: [
    SearchPage,
    CityModalComponent,
    CalendarModalComponent,
    PassengerModalComponent
  ],
  entryComponents: [
    CityModalComponent,
    CalendarModalComponent,
    PassengerModalComponent
  ]
})
export class SearchPageModule { }
