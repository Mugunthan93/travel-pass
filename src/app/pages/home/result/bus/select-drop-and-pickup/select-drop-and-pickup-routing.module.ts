import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDropAndPickupPage } from './select-drop-and-pickup.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDropAndPickupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDropAndPickupPageRoutingModule {}
