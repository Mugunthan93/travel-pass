import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApprovalRequest } from 'src/app/stores/approval.state';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.page.html',
  styleUrls: ['./approval-request.page.scss'],
})
export class ApprovalRequestPage implements OnInit {

  constructor(
    private store: Store,
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  viewApproval(type: string) {
    this.store.dispatch(new ApprovalRequest(type));
  }

}
