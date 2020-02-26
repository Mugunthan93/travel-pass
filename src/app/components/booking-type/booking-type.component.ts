import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { booking, BookingService } from 'src/app/services/booking/booking.service';
=======
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2

@Component({
  selector: 'app-booking-type',
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
})
export class BookingTypeComponent implements OnInit {

<<<<<<< HEAD
  booking : booking;

  constructor(
    public bookingService : BookingService
  ){
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);

=======
  constructor(){
    
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2
  }

  ngOnInit(): void {

  }

}
