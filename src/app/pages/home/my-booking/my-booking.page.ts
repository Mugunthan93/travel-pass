import { Component, OnInit } from '@angular/core';
import { IonTabButton, MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { MyBooking } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {

  constructor(
    private store: Store,
    public menuCtrl : MenuController
  ) { }

  ngOnInit() {
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  viewBooking(type : string) {
    this.store.dispatch(new MyBooking(type));
  }

}
