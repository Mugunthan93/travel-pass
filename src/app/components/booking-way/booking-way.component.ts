import { Component, OnInit, Input } from '@angular/core';
import { booking, BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-booking-way',
  templateUrl: './booking-way.component.html',
  styleUrls: ['./booking-way.component.scss'],
})
export class BookingWayComponent implements OnInit {

  booking : booking;

  constructor(
    public bookingService : BookingService
  ) { 
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);
  }

  ngOnInit() {
  }

  tripWayChange(event) {
    console.log(event);
  }

}
