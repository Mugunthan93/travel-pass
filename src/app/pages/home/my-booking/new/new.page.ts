import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  newBookings$: Observable<any[]>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.newBookings$ = this.store.select(BookingState.getNewBooking);

  }

  tripType(book: any) {
    switch (book.trip_requests.JourneyType) {
      case 1: return 'One Way'; break;
      case 2: return 'Round Trip'; break;
      case 3: return 'Multi City'; break;
      default: return '';
    }
  }

}
