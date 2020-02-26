import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD
import { BookingService, booking } from 'src/app/services/booking/booking.service';
=======
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit {
<<<<<<< HEAD
  
  booking: booking;

  constructor(
    public bookingService: BookingService
  ) {
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);
  }


=======

  @Input() pageType : string;

  constructor() {

  }

  
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2
  ngOnInit(): void {
  }


}
