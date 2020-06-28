import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  historyBookings: Observable<any[]>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {

    this.historyBookings = this.store.select(BookingState.getHistoryBooking);

  }

}
