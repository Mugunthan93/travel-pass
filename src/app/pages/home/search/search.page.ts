import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { SearchState } from 'src/app/stores/search.state';
import { Navigate } from '@ngxs/router-plugin';
import { StateReset } from 'ngxs-reset-plugin';
import { FlightSearchState } from 'src/app/stores/search/flight.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';
import { RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchMode$: Observable<any>;

  constructor(
    private store : Store
  ) {
  }

  ngOnInit() {
    this.searchMode$ = this.store.select(SearchState.getSearchMode);
  }

  back() {
    this.store.dispatch(new StateReset(SearchState));
    this.store.dispatch(new Navigate(['/','home','dashboard','home-tab']));
  }

}
