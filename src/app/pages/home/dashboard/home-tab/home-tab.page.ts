import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SearchFlight, SearchHotel, SearchBus } from 'src/app/stores/dashboard.state';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
  }

  searchFlight() {
    this.store.dispatch(new SearchFlight());
  }

  searchBus() {
    this.store.dispatch(new SearchBus());
  }

  searchHotel() {
    this.store.dispatch(new SearchHotel());
  }

  searchCab() {
    
  }

}
