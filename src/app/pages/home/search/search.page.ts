import { Component, OnInit } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  currentBooking : booking;

  constructor(
    public bookingService: BookingService
  ) {
    this.currentBooking = this.bookingService.getBooking;
  }

  ngOnInit() {
  }

}
