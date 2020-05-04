import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDropAndPickupPageRoutingModule } from './select-drop-and-pickup-routing.module';

import { SelectDropAndPickupPage } from './select-drop-and-pickup.page';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDropAndPickupPageRoutingModule,
    MatStepperModule
  ],
  declarations: [SelectDropAndPickupPage]
})
export class SelectDropAndPickupPageModule {}
