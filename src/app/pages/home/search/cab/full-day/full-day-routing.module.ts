import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullDayPage } from './full-day.page';

const routes: Routes = [
  {
    path: '',
    component: FullDayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullDayPageRoutingModule {}
