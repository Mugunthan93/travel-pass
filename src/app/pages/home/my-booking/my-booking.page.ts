import { Component, OnInit } from '@angular/core';
import { IonTabButton, MenuController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BookingState, ChangeBookingMode, MyBooking, SetStatus } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {

  type$ : Observable<string>;
  bookingType$: Observable<string>;

  statusAlertOptions: AlertOptions;
  status$ : Observable<string>;
  statusArray : string[];

  constructor(
    private store: Store,
    public menuCtrl : MenuController
  ) { }


  ngOnInit() {

    this.statusAlertOptions = {
      cssClass: 'cc',
      header : 'Status'
    }

    this.type$ = this.store.select(BookingState.getType);
    this.bookingType$ = this.store.select(BookingState.getBookingMode);
    this.status$ = this.store.select(BookingState.getStatus);
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  bookingChange(evt : CustomEvent) {
    console.log(evt);
    if(evt.detail.checked) {
      this.store.dispatch(new ChangeBookingMode("online"));
    }
    else if(!evt.detail.checked){
      this.store.dispatch(new ChangeBookingMode("offline"));
    }
  }

  statusChange(evt : CustomEvent) {
    this.store.dispatch(new SetStatus(evt.detail.value));
  }

  viewBooking(type : string) {
    this.store.dispatch(new MyBooking(type));
  }

  tabChange(evt : any) {
    this.statusArr(evt.tab);
    this.store.dispatch(new SetStatus(this.statusArray[0]));
    console.log(evt);
  }

  statusArr(tab : string) {
    if(tab == 'new') {
      this.statusArray = ['open','pending','cancellation pending','reschedule pending'];
    }
    else if(tab == 'history') {
      this.statusArray = ['booked','cancelled','rescheduled'];
    }
  }

}
