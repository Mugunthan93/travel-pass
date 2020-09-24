import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';
import { CalendarModule } from 'ion2-calendar';
import { EligibilityComponent } from 'src/app/components/shared/eligibility/eligibility.component';

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
    PassengerModalComponent,
    EligibilityComponent
  ],
  entryComponents: [
    PassengerModalComponent
  ]
})
export class SearchPageModule { }
