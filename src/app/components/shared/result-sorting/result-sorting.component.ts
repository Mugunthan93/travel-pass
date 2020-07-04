import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { sortButton, FlightResultState, SortChange } from 'src/app/stores/result/flight.state';

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

  buttons$: Observable<sortButton[]>;
  currentButton: sortButton;

  @Output() sort: EventEmitter<sortButton> = new EventEmitter<sortButton>(null);

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.buttons$ = this.store.select(FlightResultState.getButtons);
  }
  
  sortChange(evt: CustomEvent) {
    this.currentButton = evt.detail.value;
    this.store.dispatch(new SortChange(evt.detail.value));
  }

  sorting(item: sortButton) {
    this.sort.emit(item);
  }

}
