import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState } from 'src/app/stores/approval.state';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.scss'],
})
export class ApproveRequestComponent implements OnInit {

  flightDetail : Observable<any>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.flightDetail = this.store.selectSnapshot(ApprovalState.getSelectedRequest);
  }
  
  approveRequest() {

  }

  declineRequest() {
    
  }

}
