import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewRequestComponent } from 'src/app/components/shared/view-request/view-request.component';
import { BookingState, SetCurrentRequest, SetTripStatus, SetType } from 'src/app/stores/booking.state';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-tab',
  templateUrl: './trip-tab.page.html',
  styleUrls: ['./trip-tab.page.scss'],
})
export class TripTabPage implements OnInit {

  allBooking$ : Observable<any[]>;
  loading : any[];
  status : string = "active";
  activeStatus : string[] = ['new','open','pending','reschedule_pending'];
  confirmedStatus : string[] = ['booked','rescheduled'];
  completedStatus : string[] = ['booked','cancelled'];
  sortObj = {label: "traveldate", state: "rotated", property: "traveldate"};
  getLoading$ : Observable<boolean>;

  tripStatus$: Observable<string>;
  activePending$ : Observable<number>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.loading = [1,2,3,4,5,6];
    this.getLoading$ = this.store.select(BookingState.getLoading);
    this.allBooking$ = this.store.select(BookingState.getAllBookings);

    this.tripStatus$ = this.store.select(BookingState.getTripStatus);
    this.activePending$ = this.store.select(BookingState.getActiveBooking);

  }

  changeStatus(evt : CustomEvent) {
    this.store.dispatch([new SetTripStatus(evt.detail.value)]);
  }


  async getBook(request : any) {
    let modal = await this.modalCtrl.create({
      component : ViewRequestComponent,
      id : 'view-req'
    });

    this.store.dispatch([new SetCurrentRequest(request),new SetType(request.type)]);
    return await modal.present();
  }

  getStatus(status : string) {
    if(status == 'new') {
      return 'Requested';
    }
    else if(status == 'open') {
      return 'Approved';
    }
    else if(status == 'rej') {
      return 'Rejected';
    }
    else {
      return status;
    }
  }
}
