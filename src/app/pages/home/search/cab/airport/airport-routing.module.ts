import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirportPage } from './airport.page';

const routes: Routes = [
  {
    path: '',
    component: AirportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AirportPageRoutingModule {}
