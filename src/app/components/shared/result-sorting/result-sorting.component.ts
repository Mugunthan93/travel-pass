import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { sortButton, FlightResultState, SortChange, SortBy } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import * as _ from 'lodash';

@Component({
  selector: 'app-result-sorting',
  templateUrl: './result-sorting.component.html',
  styleUrls: ['./result-sorting.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('225ms ease-out')),
      transition('default => rotated', animate('225ms ease-in'))
    ])
  ]
})
export class ResultSortingComponent implements OnInit {

  resultMode$: Observable<string>;

  flightbuttons$: Observable<sortButton[]>;
  hotelbuttons$: Observable<sortButton[]>;
  
  currentflightButton$: Observable<sortButton>;
  currenthotelButton$: Observable<sortButton>;

  currentflightButton: sortButton;
  currenthotelButton: sortButton;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.resultMode$ = this.store.select(ResultState.getResultMode);

    this.flightbuttons$ = this.store.select(FlightResultState.getButtons);
    this.hotelbuttons$ = this.store.select(FlightResultState.getButtons);

    this.currentflightButton$ = this.store.select(FlightResultState.getSortBy);
    this.currenthotelButton$ = this.store.select(FlightResultState.getSortBy);

    this.currentflightButton$.subscribe(el => this.currentflightButton = el);
    this.currenthotelButton$.subscribe(el => this.currenthotelButton = el);
  }
  
  sortChange(evt: CustomEvent) {
    this.store.dispatch(new SortChange(evt.detail.value));
  }

  sorting(item: sortButton) {
    console.log(item);
    this.store.dispatch(new SortBy(item));
  }

  selectedButton(button : sortButton) {
    if (this.currentflightButton.property == button.property) {
      return 'selectedItem';
    }
    else if (!(this.currentflightButton.property == button.property)){
      return '';
    }
  }

}
