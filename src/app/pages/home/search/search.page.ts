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
export class SearchPage implements OnInit,OnDestroy {

  searchMode$: Observable<any>;
  search: string;
  searchSub: Subscription;

  constructor(
    private store : Store
  ) {
  }

  ngOnInit() {
    this.searchMode$ = this.store.select(SearchState.getSearchMode);
    this.searchSub = this.searchMode$.subscribe(
      (mode : string) => {
        this.search = mode;
      }
    );
  }

  back() {
    this.store.dispatch(
      new StateReset(
        SearchState,
        FlightSearchState,
        OneWaySearchState,
        RoundTripSearchState,
        MultiCitySearchState
      ));
    this.store.dispatch(new Navigate(['/','home','dashboard','home-tab']));
  }

  ngOnDestroy() {
    if (!this.searchSub.closed) {
      this.searchSub.unsubscribe();
    }
  }

}
