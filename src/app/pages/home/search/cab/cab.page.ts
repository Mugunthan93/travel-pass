import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchState, SearchType } from 'src/app/stores/search.state';
import { CabSearchState, TripType, TravelType } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-cab',
  templateUrl: './cab.page.html',
  styleUrls: ['./cab.page.scss'],
})
export class CabPage implements OnInit {

  searchType$: Observable<string>;
  travelType$: Observable<string>;
  tripType$: Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.searchType$ = this.store.select(SearchState.getSearchType);
    this.travelType$ = this.store.select(CabSearchState.getTravelType);
    this.tripType$ = this.store.select(CabSearchState.getTripType);
  }

  tripChange(evt : CustomEvent) {

    if(evt.detail.value == "out-station") {
      this.store.dispatch([
        new TravelType(evt.detail.value),
        new SearchType('one-way'),
        new Navigate(['/','home','search','cab','one-way'])
      ]);
    }
    else if(evt.detail.value == "local") {
      this.store.dispatch([
        new TravelType(evt.detail.value),
        new SearchType('half-day'),
        new Navigate(['/','home','search','cab','local'])
      ]);
    }
    else {
      this.store.dispatch([
        new TravelType(evt.detail.value),
        new Navigate(['/','home','search','cab',evt.detail.value])
      ]);
    }

  }

  typeChange(evt : CustomEvent) {
    if(evt.detail.value == "half-day" || evt.detail.value == "full-day") {
      this.store.dispatch([
        new SearchType(evt.detail.value)
      ]);
    }
    else {
      this.store.dispatch([
        new SearchType(evt.detail.value),
        new TripType(evt.detail.value),
        new Navigate(['/','home','search','cab',evt.detail.value])
      ]);
    }
  }

}
