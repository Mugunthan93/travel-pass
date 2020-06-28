import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApprovalRequest } from 'src/app/stores/approval.state';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.page.html',
  styleUrls: ['./approval-request.page.scss'],
})
export class ApprovalRequestPage implements OnInit {

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
  }

  viewApproval(type: string) {
    this.store.dispatch(new ApprovalRequest(type));
  }

}
