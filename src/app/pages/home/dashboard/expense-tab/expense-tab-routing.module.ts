import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseTabPage } from './expense-tab.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseTabPageRoutingModule {}
