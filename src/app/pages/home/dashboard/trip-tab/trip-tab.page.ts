import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BookingState, MyAllBooking } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-trip-tab',
  templateUrl: './trip-tab.page.html',
  styleUrls: ['./trip-tab.page.scss'],
})
export class TripTabPage implements OnInit {

  allBooking$ : Observable<any[]>;
  status : string = "active";
  activeStatus : string[] = ['new','open','pending','reschedule_pending'];
  confirmedStatus : string[] = ['booked','rescheduled'];
  completedStatus : string[] = ['booked','cancelled'];
  sortObj = {label: "traveldate", state: "rotated", property: "traveldate"};

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.allBooking$ = this.store.select(BookingState.getAllBookings);
  }

  getStatus(status : string) {
    if(status == 'new') {
      return 'Requested';
    }
    else if(status == 'open') {
      return 'Approved';
    }
    else {
      return status;
    }
  }

}
