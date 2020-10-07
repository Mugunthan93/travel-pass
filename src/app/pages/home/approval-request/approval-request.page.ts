import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApprovalRequest, ApprovalState } from 'src/app/stores/approval.state';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';

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

  type$ : Observable<string>;

  ngOnInit() {
    this.type$ = this.store.select(ApprovalState);
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  viewApproval(type: string) {
    this.store.dispatch(new ApprovalRequest(type));
  }

}
