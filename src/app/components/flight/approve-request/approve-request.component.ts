import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState, AcceptRequest, DeclineRequest } from 'src/app/stores/approval.state';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.scss'],
})
export class ApproveRequestComponent implements OnInit {

  flightDetail$ : Observable<any>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.flightDetail$ = this.store.select(ApprovalState.getSelectedRequest);
  }
  
  approveRequest() {
    this.store.dispatch(new AcceptRequest());
  }

  declineRequest() {
    this.store.dispatch(new DeclineRequest());
  }

  duration(duration : number) {
    return moment.duration(duration, 'minutes').days() + "d " + moment.duration(duration, 'minutes').hours() + "h " + moment.duration(duration, 'minutes').minutes() + "m"
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
