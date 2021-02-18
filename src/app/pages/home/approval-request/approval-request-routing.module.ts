import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalRequestPage } from './approval-request.page';

const routes: Routes = [
  {
    path: '',
    component: ApprovalRequestPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalRequestPageRoutingModule {}
