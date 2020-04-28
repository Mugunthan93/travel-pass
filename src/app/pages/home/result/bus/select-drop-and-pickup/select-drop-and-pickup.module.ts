import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDropAndPickupPageRoutingModule } from './select-drop-and-pickup-routing.module';

import { SelectDropAndPickupPage } from './select-drop-and-pickup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDropAndPickupPageRoutingModule
  ],
  declarations: [SelectDropAndPickupPage]
})
export class SelectDropAndPickupPageModule {}
