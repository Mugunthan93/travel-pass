import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { sortButton, SortState, SortChange, SortBy } from 'src/app/stores/result/sort.state';
import * as _ from 'lodash';
import { switchMap } from 'rxjs/operators';
import { ResultState } from 'src/app/stores/result.state';

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

  resultMode: string;

  buttons$: Observable<sortButton[]>;
  currentButton$: Observable<sortButton>;
  currentButton: sortButton = { label: null, state: null, property: null };

  constructor(
    private store : Store
  ) { }

  ngOnInit() {

    this.buttons$ = this.store.select(SortState.getButtons);
    this.resultMode = this.store.selectSnapshot(ResultState.getResultMode);
    if (this.resultMode == 'flight') {
      this.currentButton$ = this.store.select(SortState.getFlightSortBy); 
    }
    else if (this.resultMode == 'hotel') {
      this.currentButton$ = this.store.select(SortState.getHotelSortBy);
    }
    else if (this.resultMode == 'bus') {
      this.currentButton$ = this.store.select(SortState.getBusSortBy);
    }
    this.currentButton$.subscribe(el => this.currentButton = el);

  }
  
  SortChange(evt: CustomEvent) {
    if (evt.detail.value.property !== this.currentButton.property) {
      this.store.dispatch(new SortChange(evt.detail.value, this.resultMode));
    }
  }

  SortBy(item: sortButton) {
    this.store.dispatch(new SortBy(item, this.resultMode));
  }

  selectedButton(button: sortButton): string {
    if (this.currentButton.property == button.property) {
      return 'selectedItem';
    }
    else if (this.currentButton.property == button.property){
      return '';
    }
  }
}
