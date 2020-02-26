import { Component, OnInit } from '@angular/core';
import { booking, BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-booking-type',
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
})
export class BookingTypeComponent implements OnInit {

  booking : booking;

  constructor(
    public bookingService : BookingService
  ){
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);

  }

  ngOnInit(): void {

  }

}
