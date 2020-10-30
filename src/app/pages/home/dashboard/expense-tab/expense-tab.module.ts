import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseTabPageRoutingModule } from './expense-tab-routing.module';

import { ExpenseTabPage } from './expense-tab.page';
import { TripComponent } from 'src/app/components/expense/trip/trip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ExpenseTabPageRoutingModule
  ],
  declarations: [
    ExpenseTabPage,
    TripComponent
  ],
  entryComponents: [
    TripComponent 
  ]
})
export class ExpenseTabPageModule {}
