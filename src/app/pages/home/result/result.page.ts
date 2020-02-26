import { Component, OnInit } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  booking : booking;
  resultData : any;

  constructor(
    public bookingService: BookingService
  ) {
    this.booking = this.bookingService.getBooking;
   }

  ngOnInit() {
  }

}
