import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  currentPage: string = "search";
  currentCarrier: string;

  constructor(
    public booking: BookingService
  ) {

    this.currentCarrier = this.booking.bookingCarrier;
    console.log(this.currentCarrier);
  }

  ngOnInit() {
  }

}
