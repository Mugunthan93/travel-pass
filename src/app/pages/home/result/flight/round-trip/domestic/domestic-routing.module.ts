import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomesticPage } from './domestic.page';

const routes: Routes = [
  {
    path: '',
    component: DomesticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DomesticPageRoutingModule {}
