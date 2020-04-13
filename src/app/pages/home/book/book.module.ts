import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { PassengerDetailComponent } from 'src/app/components/flight/passenger-detail/passenger-detail.component';
import { MealBaggageComponent } from 'src/app/components/flight/meal-baggage/meal-baggage.component';
import { CalendarModule } from 'ion2-calendar';
import { FlightListComponent } from 'src/app/components/flight/flight-list/flight-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookPageRoutingModule,
    CalendarModule
  ],
  declarations: [
    BookPage,
    PassengerInfoComponent,
    PassengerDetailComponent,
    MealBaggageComponent,
    FlightListComponent
  ],
  entryComponents: [
    PassengerInfoComponent,
    PassengerDetailComponent,
    MealBaggageComponent
  ]
})
export class BookPageModule {}
