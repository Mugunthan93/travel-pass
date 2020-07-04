import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashboardState, upcomingTrips } from 'src/app/stores/dashboard.state';

export interface tripList {
  from : string
  to : string
  date : string
  time : string
}

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {

  upcomingTrips$: Observable<upcomingTrips[]>;

  constructor(
    private store : Store
  ) {
   }

  ngOnInit() {
    this.upcomingTrips$ = this.store.select(DashboardState.getUpcomingTrips);
  }

}
