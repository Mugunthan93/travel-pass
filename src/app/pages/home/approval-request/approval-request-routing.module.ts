import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalRequestPage } from './approval-request.page';

const routes: Routes = [
  {
    path: ':approveType',
    component: ApprovalRequestPage,
    children: [
      {
        path: 'request-list',
        loadChildren: () => import('./request-list/request-list.module').then( m => m.RequestListPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalRequestPageRoutingModule {}
