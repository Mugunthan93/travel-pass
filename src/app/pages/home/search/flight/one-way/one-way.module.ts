import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneWayPageRoutingModule } from './one-way-routing.module';

import { OneWayPage } from './one-way.page';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { CalendarModalComponent } from 'src/app/components/calendar-modal/calendar-modal.component';

import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OneWayPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [
    OneWayPage,
    CityModalComponent,
    CalendarModalComponent
  ],
  entryComponents: [
    CityModalComponent,
    CalendarModalComponent
  ]
})
export class OneWayPageModule { }
