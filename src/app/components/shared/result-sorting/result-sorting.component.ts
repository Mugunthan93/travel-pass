import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { sortButton, SortState, SortChange, SortBy } from 'src/app/stores/result/sort.state';
import { ResultState } from 'src/app/stores/result.state';
import { flatMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: "app-result-sorting",
  templateUrl: "./result-sorting.component.html",
  styleUrls: ["./result-sorting.component.scss"],
  animations: [
    trigger("rotatedState", [
      state("default", style({ transform: "rotate(0)" })),
      state("rotated", style({ transform: "rotate(180deg)" })),
      transition("rotated => default", animate("225ms ease-out")),
      transition("default => rotated", animate("225ms ease-in")),
    ]),
  ],
})
export class ResultSortingComponent implements OnInit, OnChanges {
  resultMode: string;
  @Input() type: string;

  buttons$: Observable<sortButton[]>;
  currentButton$: Observable<sortButton>;
  currentButton: sortButton = { label: null, state: null, property: null };
  searchMode: string;

  constructor(private store: Store) {}

  ngOnInit() {

    this.buttons$ = of(this.type).pipe(
      flatMap((type: string) => {
        if (type == "departure") {
          console.log("departure called");
          return this.store.select(SortState.getDepartureButtons);
        } else if (type == "return") {
          console.log("return called");
          return this.store.select(SortState.getReturnButtons);
        } else {
          console.log("normal called");
          return this.store.select(SortState.getButtons);
        }
      })
    );

    this.resultMode = this.store.selectSnapshot(ResultState.getResultMode);

    if (this.resultMode == "flight") {
      if (this.type == "departure") {
        this.currentButton$ = this.store.select(SortState.getDepartureSortBy);
      } else if (this.type == "return") {
        this.currentButton$ = this.store.select(SortState.getReturnSortBy);
      } else {
        this.currentButton$ = this.store.select(SortState.getFlightSortBy);
      }
    } else if (this.resultMode == "hotel") {
      this.currentButton$ = this.store.select(SortState.getHotelSortBy);
    } else if (this.resultMode == "bus") {
      this.currentButton$ = this.store.select(SortState.getBusSortBy);
    }

    this.currentButton$.subscribe((el) => {
      if(this.currentButton) {
        console.log(el);
        this.currentButton = el
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    this.buttons$ = of(changes.type.currentValue).pipe(
      flatMap((type: string) => {
        if (type == "departure") {
          console.log("departure called");
          return this.store.select(SortState.getDepartureButtons);
        } else if (type == "return") {
          console.log("return called");
          return this.store.select(SortState.getReturnButtons);
        } else {
          console.log("normal called");
          return this.store.select(SortState.getButtons);
        }
      })
    );

    if (this.currentButton$) {
      this.currentButton$.subscribe((el) => {
        console.log(el);
        this.currentButton = el
      });
    }

    if (changes.type.currentValue == "departure") {
      this.currentButton$ = this.store.select(SortState.getDepartureSortBy);
    } else if (changes.type.currentValue == "return") {
      this.currentButton$ = this.store.select(SortState.getReturnSortBy);
    }

  }

  SortBy(item: sortButton, index : number) {
    console.log(item,this.currentButton,index);
    if (item.property !== this.currentButton.property) {
      this.store.dispatch(new SortChange(item, this.resultMode, this.type));
      this.store.dispatch(new SortBy(item, this.resultMode, this.type));
    } else if (item.property == this.currentButton.property) {
      this.store.dispatch(new SortBy(item, this.resultMode, this.type));
    }
  }

  selectedButton(button: sortButton): string {
    if (this.currentButton.property == button.property) {
      return "selectedItem";
    } else {
      return "";
    }
  }
}
