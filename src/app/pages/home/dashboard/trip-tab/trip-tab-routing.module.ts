import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripTabPage } from './trip-tab.page';

const routes: Routes = [
  {
    path: '',
    component: TripTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripTabPageRoutingModule {}
