import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseTabPageRoutingModule } from './expense-tab-routing.module';

import { ExpenseTabPage } from './expense-tab.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TripComponent } from 'src/app/components/expense/trip/trip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ExpenseTabPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ExpenseTabPage
  ]
})
export class ExpenseTabPageModule {}
