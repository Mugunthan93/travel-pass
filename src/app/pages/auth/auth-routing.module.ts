import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children:[
      {
        path: 'signup',
        loadChildren: () => import('./signup/signup.module').then(
          (mod) => {
            return mod.SignupPageModule;
          }
        )
      },
      {
        path: 'login',
        loadChildren:  () => import('./login/login.module').then(
          (mod) => {
          return mod.LoginPageModule;
        })
      },
      {
        path:'',
        redirectTo : '/auth/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'',
    redirectTo : '/auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
