import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { ApprovalRequest, ApprovalState } from 'src/app/stores/approval.state';

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
}
