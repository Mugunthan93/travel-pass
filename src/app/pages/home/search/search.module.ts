import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { CalendarModalComponent } from 'src/app/components/calendar-modal/calendar-modal.component';
import { PassengerModalComponent } from 'src/app/components/passenger-modal/passenger-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchPageRoutingModule,
    NgCalendarModule
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
