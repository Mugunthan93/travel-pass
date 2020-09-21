import { Component, OnInit, Input } from '@angular/core';
import { user } from 'src/app/models/user';
import { of, from, Observable } from 'rxjs';
import { groupBy, mergeMap, reduce, tap, map, toArray, flatMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddEmployee, hotelpassenger, HotelPassengerState } from 'src/app/stores/passenger/hotel.passenger.state';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss'],
})
export class ListEmployeeComponent implements OnInit {

  @Input() employee: Observable<user[]>;

  hotelpass: Observable<hotelpassenger[]>;

  constructor(
    private store : Store
  ) {
  }

  ngOnInit() { 
    this.hotelpass = this.store.select(HotelPassengerState.GetAdult);
  }

  SelectEmployee(e : user) {
    this.store.dispatch(new AddEmployee(e));
  }

  checkAdded(e : user) : Observable<boolean> {
    return this.hotelpass
      .pipe(
        map(
          (pass: hotelpassenger[]) => {
            let passname = pass.reduce((acc, cur) => [...acc, cur.FirstName], []);
            return passname.includes(e.name);
        })
      );
  }

}
