import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'result',
        loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
      },
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then(m => m.BookPageModule)
      },
      {
        path: 'approval-request',
        loadChildren: () => import('./approval-request/approval-request.module').then(m => m.ApprovalRequestPageModule)
      },
      {
        path: '',
        redirectTo: '/home/dashboard/home-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/dashboard/home-tab',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'expense-list',
    loadChildren: () => import('./expense-list/expense-list.module').then( m => m.ExpenseListPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
