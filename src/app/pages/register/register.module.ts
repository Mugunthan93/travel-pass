import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { CustomStepperComponent } from 'src/app/components/custom-stepper/custom-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { AddBranchComponent } from 'src/app/components/add-branch/add-branch.component';
import { AddUserComponent } from 'src/app/components/add-user/add-user.component';
import { AddProfileComponent } from 'src/app/components/add-profile/add-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    CdkStepperModule
  ],
  declarations: [
    RegisterPage,
    CustomStepperComponent,
    AddBranchComponent,
    AddUserComponent,
    AddProfileComponent
  ]
})
export class RegisterPageModule {}
