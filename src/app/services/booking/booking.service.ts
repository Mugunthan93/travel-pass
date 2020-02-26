import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookingCarrier: string;
  bookingPage: string;
  bookingType: string;
  bookingWay: string;

  constructor() { }

  set setBookingCarrier(carrier: string) {
    this.bookingCarrier = carrier;
  }

  set setBookingPage(page: string) {
    this.bookingPage = page;
  }

  set setBookingType(type: string) {
    this.bookingType = type;
  }

  set setBookingWay(way: string) {
    this.bookingWay = way;
  }

  get getBookingCarrier() {
    return this.bookingCarrier;
  }

  get getBookingpage() {
    return this.bookingPage;
  }

  get getBookingType() {
    return this.bookingType;
  }

  get getBookingWay() {
    return this.bookingWay;
  }


}
