import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherRequestPage } from './other-request.page';

const routes: Routes = [
  {
    path: '',
    component: OtherRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherRequestPageRoutingModule {}
