import { Component, OnInit, Input } from '@angular/core';
import { user } from 'src/app/models/user';
import { of, from, Observable } from 'rxjs';
import { groupBy, mergeMap, reduce, tap, map, toArray, flatMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddEmployee, hotelpassenger, HotelPassengerState } from 'src/app/stores/passenger/hotel.passenger.state';
import { BookState } from 'src/app/stores/book.state';
import { AddFlightEmployee, AddPassenger, flightpassenger, FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss'],
})
export class ListEmployeeComponent implements OnInit {

  @Input() employee: Observable<user[]>;

  bookMode : string;
  hotelpass: Observable<hotelpassenger[]>;
  flightpass: Observable<flightpassenger[]>;

  constructor(
    private store : Store
  ) {
  }

  ngOnInit() {
    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);

    this.flightpass = this.store.select(FlightPassengerState.getPassengers);
    this.hotelpass = this.store.select(HotelPassengerState.GetAdult);
  }

  SelectEmployee(e : user) {

    if(this.bookMode == "flight") {
      this.store.dispatch(new AddFlightEmployee(e));
    }
    else if(this.bookMode == "hotel"){
      this.store.dispatch(new AddEmployee(e));
    }
  }

  checkAdded(e : user) : Observable<boolean> {
    switch(this.bookMode) {
      case 'flight' : return this.flightpass
        .pipe(
          map(
            (pass: flightpassenger[]) => {
              let passname = pass.reduce((acc, cur) => [...acc, cur.FirstName], []);
              return passname.includes(e.name);
          })
        );
      case 'hotel' : return this.hotelpass
        .pipe(
          map(
            (pass: hotelpassenger[]) => {
              let passname = pass.reduce((acc, cur) => [...acc, cur.FirstName], []);
              return passname.includes(e.name);
          })
        );
    }
  }

}
