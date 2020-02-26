import { Component, OnInit } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  booking : booking;
  searchData : any;

  constructor(
    public bookingService: BookingService
  ) {
    this.booking = this.bookingService.getBooking;
  }

  ngOnInit() {
  }

}
