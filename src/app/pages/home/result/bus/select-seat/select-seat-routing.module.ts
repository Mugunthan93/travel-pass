import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSeatPage } from './select-seat.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSeatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSeatPageRoutingModule {}
