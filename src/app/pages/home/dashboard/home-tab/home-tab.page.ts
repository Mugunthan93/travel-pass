import { Component, OnInit } from '@angular/core';
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
    this.router.navigate(['/', 'home', 'search', 'bus']);
  }

  searchHotel() {
    this.router.navigate(['/', 'home', 'search', 'hotel']);
  }

  searchCab() {
    
  }

}
