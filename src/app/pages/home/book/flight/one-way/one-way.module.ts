import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneWayPageRoutingModule } from './one-way-routing.module';

import { OneWayPage } from './one-way.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OneWayPageRoutingModule,
    MatExpansionModule,
    SharedModule,
    PipeModule
  ],
  declarations: [
    OneWayPage
  ]
})
export class OneWayPageModule {}
