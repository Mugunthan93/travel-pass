import { Component, OnInit } from '@angular/core';
import { IonTabButton } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { MyBooking } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
  }

  viewBooking(type : string) {
    this.store.dispatch(new MyBooking(type));
  }

}
