import { Component, OnInit } from '@angular/core';
import { IonTabButton, MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BookingState, ChangeBookingMode, MyBooking } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {

  type$ : Observable<string>;
  bookingType$: Observable<string>;

  constructor(
    private store: Store,
    public menuCtrl : MenuController
  ) { }


  ngOnInit() {
    this.type$ = this.store.select(BookingState.getType);
    this.bookingType$ = this.store.select(BookingState.getBookingMode);
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  bookingChange(evt : CustomEvent) {
    this.store.dispatch(new ChangeBookingMode(evt.detail.value));
  }

  viewBooking(type : string) {
    this.store.dispatch(new MyBooking(type));
  }

}
