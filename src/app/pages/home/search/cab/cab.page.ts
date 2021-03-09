import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchState, SearchType } from 'src/app/stores/search.state';
import { CabSearchState, JourneyType, TravelType } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-cab',
  templateUrl: './cab.page.html',
  styleUrls: ['./cab.page.scss'],
})
export class CabPage implements OnInit {

  journeyType$: Observable<string>;
  travelType$: Observable<unknown>;
  SearchType$: Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.journeyType$ = this.store.select(CabSearchState.getJourneyType).pipe(map((type : number) => {
      if (type == 1) {
        return 'one-way';
      }
      else if (type == 2) {
        return 'round-trip';
      }
      else if (type == 3) {
        return 'multi-city';
      }
    }));

    this.SearchType$ = this.store.select(SearchState.getSearchType);
    this.travelType$ = this.store.select(CabSearchState.getTravelType);
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
        new JourneyType(evt.detail.value),
        new SearchType(evt.detail.value),
        new Navigate(['/','home','search','cab',evt.detail.value])
      ]);
    }
  }

  travelChange(evt: CustomEvent) {
    this.store.dispatch(new TravelType(evt.detail.value));
  }

}
