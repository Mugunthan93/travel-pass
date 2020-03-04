import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabPage } from './cab.page';

const routes: Routes = [
  {
    path: '',
    component: CabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabPageRoutingModule {}
