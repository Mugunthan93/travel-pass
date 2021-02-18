import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { ForgotPasswordComponent } from 'src/app/components/flight/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AuthPageRoutingModule
  ],
  declarations: [
    AuthPage,
    ForgotPasswordComponent
  ],
  entryComponents: [
    ForgotPasswordComponent
  ]
})
export class AuthPageModule {}
