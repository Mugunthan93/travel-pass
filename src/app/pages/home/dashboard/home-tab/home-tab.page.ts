import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SearchFlight, SearchHotel, SearchBus, UpcomingTrips, SearchTrain, AllUpcomingTrips } from 'src/app/stores/dashboard.state';
import { StateReset } from 'ngxs-reset-plugin';
import { SearchState } from 'src/app/stores/search.state';
import { ResultState } from 'src/app/stores/result.state';
import { BookState } from 'src/app/stores/book.state';
import { FilterState } from 'src/app/stores/result/filter.state';
import { SortState } from 'src/app/stores/result/sort.state';
import { SharedState } from 'src/app/stores/shared.state';
import { PassengerState } from 'src/app/stores/passenger.state';
import { ApprovalState } from 'src/app/stores/approval.state';
import { BookingState, GetRescheduleTicket } from 'src/app/stores/booking.state';
import { RescheduleComponent } from 'src/app/components/shared/reschedule/reschedule.component';

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
    this.store.dispatch(
      new StateReset(
        SearchState,
        ResultState,
        BookState,
        SharedState,
        FilterState,
        PassengerState,
        SortState,

        BookingState,
        ApprovalState
      )
    );
    this.store.dispatch(new AllUpcomingTrips());
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

  searchTrain() {
    this.store.dispatch(new SearchTrain());
  }


}
