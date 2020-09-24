import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SearchType } from 'src/app/stores/search.state';
import { Navigate } from '@ngxs/router-plugin';
import { TrainSearchState, TrainType } from 'src/app/stores/search/train.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-train',
  templateUrl: './train.page.html',
  styleUrls: ['./train.page.scss'],
})
export class TrainPage implements OnInit {

  journeyType$: Observable<string>;
  trainType$: Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.journeyType$ = this.store.select(TrainSearchState.getJourneyType).pipe(map((type: number) => {
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
    this.trainType$ = this.store.select(TrainSearchState.getTrainType);
  }

  typeChange(evt: CustomEvent) {
    this.store.dispatch(new SearchType(evt.detail.value));
    this.store.dispatch(new TrainType('domestic'));
    this.store.dispatch(new Navigate(['/', 'home', 'search', 'train', evt.detail.value]));
  }

  categoryChange(evt: CustomEvent) {
    this.store.dispatch(new TrainType(evt.detail.value));
  }

}
