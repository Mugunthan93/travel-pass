import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HalfDayPage } from './half-day.page';

const routes: Routes = [
  {
    path: '',
    component: HalfDayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalfDayPageRoutingModule {}
