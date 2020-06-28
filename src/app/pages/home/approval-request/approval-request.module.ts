import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalRequestPageRoutingModule } from './approval-request-routing.module';

import { ApprovalRequestPage } from './approval-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalRequestPageRoutingModule
  ],
  declarations: [
    ApprovalRequestPage
  ]
})
export class ApprovalRequestPageModule {}
