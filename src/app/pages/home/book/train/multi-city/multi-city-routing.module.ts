import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiCityPage } from './multi-city.page';

const routes: Routes = [
  {
    path: '',
    component: MultiCityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiCityPageRoutingModule {}
