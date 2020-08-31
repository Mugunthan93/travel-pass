import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';
import { PassengerDetailComponent } from 'src/app/components/flight/passenger-detail/passenger-detail.component';
import { MealBaggageComponent } from 'src/app/components/flight/meal-baggage/meal-baggage.component';
import { CalendarModule } from 'ion2-calendar';
import { FlightListComponent } from 'src/app/components/flight/flight-list/flight-list.component';
import { SpecialRequestComponent } from 'src/app/components/hotel/special-request/special-request.component';
import { PoliciesComponent } from 'src/app/components/hotel/policies/policies.component';
import { AddGuestComponent } from 'src/app/components/hotel/add-guest/add-guest.component';
import { TermsConditionsComponent } from 'src/app/components/hotel/terms-conditions/terms-conditions.component';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FoodPipe } from 'src/app/pipes/food/food.pipe';
import { PaymentComponent } from 'src/app/components/bus/payment/payment.component';
import { MatDividerModule } from '@angular/material/divider';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BookPageRoutingModule,
    CalendarModule,
    SharedModule,
    MatDividerModule
  ],
  declarations: [
    BookPage,
    PassengerDetailComponent,
    MealBaggageComponent,
    FlightListComponent,
    SpecialRequestComponent,
    PoliciesComponent,
    AddGuestComponent,
    TermsConditionsComponent,
    BookConfirmationComponent,
    PaymentComponent,
    PassengerListComponent,
    FoodPipe
  ],
  entryComponents: [
    PassengerDetailComponent,
    MealBaggageComponent,
    SpecialRequestComponent,
    PoliciesComponent,
    AddGuestComponent,
    TermsConditionsComponent,
    BookConfirmationComponent,
    PassengerListComponent,
    PaymentComponent
  ]
})
export class BookPageModule {}
