import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalRequestPageRoutingModule } from './approval-request-routing.module';

import { ApprovalRequestPage } from './approval-request.page';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    ApprovalRequestPageRoutingModule
  ],
  declarations: [
    ApprovalRequestPage
  ],
  entryComponents: [
  ]
})
export class ApprovalRequestPageModule {}
