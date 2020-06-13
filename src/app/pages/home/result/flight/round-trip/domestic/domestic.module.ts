import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DomesticPageRoutingModule } from './domestic-routing.module';

import { DomesticPage } from './domestic.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DomesticPageRoutingModule,
    SharedModule
  ],
  declarations: [DomesticPage]
})
export class DomesticPageModule {}
