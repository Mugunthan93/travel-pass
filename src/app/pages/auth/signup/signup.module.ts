import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CustomStepperComponent } from 'src/app/components/custom-stepper/custom-stepper.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    CdkStepperModule
  ],
  declarations: [
    SignupPage,
    CustomStepperComponent
  ],
  providers : []
})
export class SignupPageModule {}
