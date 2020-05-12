import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneWayPageRoutingModule } from './one-way-routing.module';

import { OneWayPage } from './one-way.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OneWayPageRoutingModule,
    SharedModule
  ],
  declarations: [
    OneWayPage,
    ResultSortingComponent
  ]
})
export class OneWayPageModule {}
