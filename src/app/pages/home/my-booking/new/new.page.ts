import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { observable, Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  newBookings$: Observable<any[]>;
  type$ : Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.newBookings$ = this.store.select(BookingState.getNewBooking);
    this.type$ = this.store.select(BookingState.getType);
  }

  tripType(booking: any) : Observable<string> {
    console.log(booking);
    return of(booking)
    .pipe(
      withLatestFrom(this.type$),
      map(
        (booktype) => {
          let type = booktype[1];
          let booking = booktype[0];
          if(type == 'flight') {
            switch (booking.trip_requests.JourneyType) {
              case 1: return 'One Way'; break;
              case 2: return 'Round Trip'; break;
              case 3: return 'Multi City'; break;
              default: return '';
            }
          }
          else if(type == 'hotel') {
            return '';
          }
        }
      )
    );
  }

  originName(booking : any) : Observable<string> {
    return of(booking)
      .pipe(
        withLatestFrom(this.type$),
        map(
          (booktype) => {
            let type = booktype[1];
            let booking = booktype[0];
            if(type == 'flight') {
              return booking.trip_requests.Segments[0] ? booking.trip_requests.Segments[0].OriginName : '';
            }
            else if(type == 'hotel') {
              return booking.guest_details.basiscInfo.HotelName;
            }
          }
        )
      );
  }

  DestinationName(booking : any) : Observable<string> {
    return of(booking)
    .pipe(
      withLatestFrom(this.type$),
      map(
        (booktype) => {
          let type = booktype[1];
          let booking = booktype[0];
          if(type == 'flight') {
            return booking.trip_requests.Segments[0] ? booking.trip_requests.Segments[0].DestinationName : '';
          }
          else if(type == 'hotel') {
            return booking.guest_details.roomDetails[0].RoomTypeName.replace('|',' ');
          }
        }
      )
    );
  }

  updateDate(booking : any) : string {
    return booking.updatedAt;
  }

  fare(booking : any) : Observable<string> {
    return of(booking)
    .pipe(
      withLatestFrom(this.type$),
      map(
        (booktype) => {
          let type = booktype[1];
          let booking = booktype[0];
          if(type == 'flight') {
            return booking.passenger_details.fare_response.published_fare;
          }
          else if(type == 'hotel') {
            return booking.guest_details.basiscInfo.TotalBaseFare;
          }
        }
      )
    );
  }

}
