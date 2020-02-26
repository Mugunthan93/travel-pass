import { Component, OnInit, Input } from '@angular/core';
import { BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit {

  currentPage: string;

  constructor(
    public booking: BookingService
  ) {
    this.currentPage = this.booking.bookingPage;
  }


  ngOnInit(): void {
  }


}
