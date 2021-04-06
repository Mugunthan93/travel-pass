import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AllApprovalRequest, ApprovalState, GetApproveRequest, SetTripStatus } from 'src/app/stores/approval.state';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ApproveRequestComponent } from 'src/app/components/shared/approve-request/approve-request.component';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.page.html',
  styleUrls: ['./approval-request.page.scss']
})
export class ApprovalRequestPage implements OnInit {

  activePending$: Observable<number>;
  getLoading$: Observable<boolean>;

  constructor(
    private store: Store,
    public loadingCtrl : LoadingController,
    public modalCtrl : ModalController,
    private location : Location
  ) { }

  pending$ : Observable<any[]>;
  approved$ : Observable<any[]>;

  tripStatus$ : Observable<string>;
  sortObj = {label: "traveldate", state: "rotated", property: "traveldate"};

  ngOnInit() {
    this.store.dispatch(new AllApprovalRequest());
    this.pending$ = this.store.select(ApprovalState.getpending);
    this.approved$ = this.store.select(ApprovalState.getApproved);
    this.tripStatus$ = this.store.select(ApprovalState.getStatus);
    this.activePending$ = this.store.select(ApprovalState.getActiveApproval);
    this.getLoading$ = this.store.select(ApprovalState.getLoading);

  }

  changeStatus(evt : CustomEvent) {
    this.store.dispatch([new SetTripStatus(evt.detail.value)]);
  }

  getStatus(status : string) {
    if(status == 'new') {
      return 'Requested';
    }
    else if(status == 'open') {
      return 'Approved';
    }
    else {
      return status;
    }
  }

  getApprove(id : any,type : string) {
    this.store.dispatch(new GetApproveRequest(id,type,ApproveRequestComponent));
  }

  back() {
    this.location.back();
  }

}
