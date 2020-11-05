import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseListPageRoutingModule } from './expense-list-routing.module';

import { ExpenseListPage } from './expense-list.page';
import { ExpenseComponent } from 'src/app/components/expense/expense/expense.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ExpenseListPageRoutingModule
  ],
  declarations: [
    ExpenseListPage,
    ExpenseComponent
  ],
  entryComponents: [
    ExpenseComponent
  ]
})
export class ExpenseListPageModule {}
