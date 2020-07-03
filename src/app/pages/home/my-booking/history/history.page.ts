import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState, DownloadTicket } from 'src/app/stores/booking.state';
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

  tripType(book: any) {
    switch (book.trip_requests.JourneyType) {
      case 1: return 'One Way'; break;
      case 2: return 'Round Trip'; break;
      case 3: return 'Multi City'; break;
      default: return '';
    }
  }

  downloadTicket(booked) {
    this.store.dispatch(new DownloadTicket(booked));
  }

}
