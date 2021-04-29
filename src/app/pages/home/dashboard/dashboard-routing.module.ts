import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home-tab',
        loadChildren: () => import('./home-tab/home-tab.module').then(m => m.HomeTabPageModule),
      },
      {
        path: 'trip-tab',
        loadChildren: () => import('./trip-tab/trip-tab.module').then(m => m.TripTabPageModule),
      },
      {
        path: 'expense-tab',
        loadChildren: () => import('./expense-tab/expense-tab.module').then(m => m.ExpenseTabPageModule),
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule { }
