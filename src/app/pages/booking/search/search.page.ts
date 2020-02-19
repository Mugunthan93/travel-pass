import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  bookingPage : string;

  constructor(
    public route : Router
  ){
    this.bookingPage = 'Airline-Search';
  }

  searchTrip() {
    this.route.navigate(['/','booking','result']);
  }

  
  ngOnInit(): void {

  }

}
