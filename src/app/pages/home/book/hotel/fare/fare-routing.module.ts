import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarePage } from './fare.page';

const routes: Routes = [
  {
    path: '',
    component: FarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarePageRoutingModule {}
