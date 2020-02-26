import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking/booking.service';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {

  constructor(
    public router: Router,
    public booking: BookingService
  ) { }

  ngOnInit() {
  }

  search(carrier: string) {
    this.booking.bookingPage = 'search';
    this.booking.bookingCarrier = carrier;
    this.router.navigate(['/', 'home', 'search']);
  }

}
