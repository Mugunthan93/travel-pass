import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking/booking.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit() {
  }

  searchFlight() {
    this.router.navigate(['/', 'home', 'search', 'flight','one-way']);
  }

  searchBus() {
    
  }

  searchHotel() {
    this.router.navigate(['/', 'home', 'search', 'hotel']);
  }

  searchCab() {
    
  }

}
