import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestListPageRoutingModule } from './request-list-routing.module';

import { RequestListPage } from './request-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestListPageRoutingModule
  ],
  declarations: [RequestListPage]
})
export class RequestListPageModule {}
