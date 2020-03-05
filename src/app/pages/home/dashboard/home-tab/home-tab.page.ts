import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking/booking.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {

  constructor(
    public bookingService: BookingService
  ) { }

  ngOnInit() {
  }

  select(type: string) {
    this.bookingService.select(type);
  }

}
