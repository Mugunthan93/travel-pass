import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { combineLatest, observable, Observable, of } from 'rxjs';
import { debounceTime, map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  newBookings$: Observable<any[]>;
  type$ : Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.newBookings$ = this.store.select(BookingState.getNewBooking);
    this.type$ = this.store.select(BookingState.getType);
    this.loading$ = this.store.select(BookingState.getLoading);

  }

  tripType(booking: any) : string {
    // console.log(booking);
    if(booking.trip_requests.JourneyType) {
      switch (booking.trip_requests.JourneyType) {
        case 1: return 'One Way'; break;
        case 2: return 'Round Trip'; break;
        case 3: return 'Multi City'; break;
        default: return '';
      }
    }
    else {
      return '';
    }
  }

  updateDate(booking : any) : string {
    return booking.updatedAt;
  }

}
