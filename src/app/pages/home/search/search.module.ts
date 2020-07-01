import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';
import { CalendarModule } from 'ion2-calendar';

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
    PassengerModalComponent
  ],
  entryComponents: [
    CityModalComponent,
    PassengerModalComponent
  ]
})
export class SearchPageModule { }
