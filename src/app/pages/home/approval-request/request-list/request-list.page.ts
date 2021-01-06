import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState, GetApproveRequest } from 'src/app/stores/approval.state';
import { ApproveRequestComponent } from 'src/app/components/shared/approve-request/approve-request.component';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

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

  totalFair(booking : any) : Observable<number> {
    return this.type$
      .pipe(
        map(
          (type) => {
            let totalbol = _.isUndefined(booking.passenger_details.fareDetails);
            console.log(totalbol);
            switch(type) {
              case 'flight' : return booking.passenger_details.published_fare;
              case 'hotel' : return booking.guest_details.basiscInfo.TotalBaseFare;
              case 'bus' : return  totalbol ? 0 : booking.passenger_details.fareDetails.total_amount;
              case 'train' : return booking.passenger_details.basiscInfo.TotalBaseFare;
            }
          }
        )
      );
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
