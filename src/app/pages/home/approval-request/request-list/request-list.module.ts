import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestListPageRoutingModule } from './request-list-routing.module';

import { RequestListPage } from './request-list.page';
import { ApproveRequestComponent } from 'src/app/components/flight/approve-request/approve-request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestListPageRoutingModule
  ],
  declarations: [
    RequestListPage
  ],
  entryComponents: [
  ]
})
export class RequestListPageModule {}
