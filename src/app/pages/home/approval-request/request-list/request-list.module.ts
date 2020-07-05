import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestListPageRoutingModule } from './request-list-routing.module';

import { RequestListPage } from './request-list.page';
import { PipeModule } from 'src/app/modules/pipe.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestListPageRoutingModule,
    PipeModule
  ],
  declarations: [
    RequestListPage
  ],
  entryComponents: [
  ]
})
export class RequestListPageModule {}
