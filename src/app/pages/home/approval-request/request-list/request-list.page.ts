import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState, GetApproveRequest } from 'src/app/stores/approval.state';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {

  allBookings: Observable<any[]>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.allBookings = this.store.select(ApprovalState.getAllBookings);
  }

  async getApprove(id : number) {
    this.store.dispatch(new GetApproveRequest(id));
  }

  tripType(book : any) {
    switch (book.trip_requests.JourneyType) {
      case 1: return 'One Way'; break;
      case 2: return 'Round Trip'; break;
      case 3: return 'Multi City'; break;
      default: return '';
    }
  }
}
