import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CabPageRoutingModule } from './cab-routing.module';

import { CabPage } from './cab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CabPageRoutingModule
  ],
  declarations: [CabPage]
})
export class CabPageModule {}
