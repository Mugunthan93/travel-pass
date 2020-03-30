import { Component, OnInit } from '@angular/core';
import { BookingService, booking } from 'src/app/services/booking/booking.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  booking : booking;
  isLandscape: boolean;

  constructor(
    public bookingService: BookingService,
    public platform : Platform
  ) {
    if (this.bookingService) {
      this.booking = this.bookingService.getBooking;
    }
    else {
      this.booking.type = 'flight';
    }

    this.platform.resize.subscribe(async () => {
      this.isLandscape = this.platform.isLandscape();
      console.log(this.isLandscape);
    });
  }

  ngOnInit() {
  }

}
