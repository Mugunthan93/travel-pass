import { Component, OnInit } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  booking : booking;
  bookData : any;

  constructor(
    public bookingService: BookingService
  ) {
    this.booking = this.bookingService.getBooking;
   }

  ngOnInit() {
  }

}
