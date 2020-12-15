import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState, GetApproveRequest } from 'src/app/stores/approval.state';
import { ApproveRequestComponent } from 'src/app/components/shared/approve-request/approve-request.component';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {

  allBookings: Observable<any[]>;
  type$: Observable<string>;
  loading$ : Observable<boolean>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.type$ = this.store.select(ApprovalState.getType);
    this.allBookings = this.store.select(ApprovalState.getAllBookings);
    this.loading$ = this.store.select(ApprovalState.getLoading);
  }

  getApprove(id : number) {
    this.store.dispatch(new GetApproveRequest(id,ApproveRequestComponent));
  }

  tripType(book : any) {
    switch (book.trip_requests.JourneyType) {
      case 1: return 'One Way';
      case 2: return 'Round Trip';
      case 3: return 'Multi City';
      default: return '';
    }
  }
}
