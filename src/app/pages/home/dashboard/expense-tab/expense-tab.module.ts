import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseTabPageRoutingModule } from './expense-tab-routing.module';

import { ExpenseTabPage } from './expense-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseTabPageRoutingModule
  ],
  declarations: [ExpenseTabPage]
})
export class ExpenseTabPageModule {}
