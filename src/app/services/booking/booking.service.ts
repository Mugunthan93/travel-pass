import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface booking{
  page : string,
  type : string,
  way?  : string
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  booking : booking

  constructor(
    public router : Router
  ) {
  }

  set setBooking(book : booking){
    this.booking = book;
  }

  get getBooking() {
    return this.booking;
  }

  select(type : string) {
    this.booking = {
      page : 'search',
      type : type,
      way : null
    }
    this.router.navigate(['/', 'home', 'search']);
  }

  search(){

  }

  result(){

  }

  book(){

  }


}
