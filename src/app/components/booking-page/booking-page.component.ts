import { Component, OnInit, Input } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit {
  
  booking: booking;

  constructor(
    public bookingService: BookingService
  ) {
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);
  }


  ngOnInit(): void {
  }


}
