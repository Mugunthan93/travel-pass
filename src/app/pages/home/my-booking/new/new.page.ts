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

}
