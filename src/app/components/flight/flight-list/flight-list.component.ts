import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, merge, of, pipe, forkJoin } from 'rxjs';
import { meal, baggage, FLightBookState, servicebySegment } from 'src/app/stores/book/flight.state';
import { map, mergeAll } from 'rxjs/operators';
import { BookState } from 'src/app/stores/book.state';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss'],
})
export class FlightListComponent implements OnInit {

  onwardMeal$: Observable<servicebySegment[]>;
  returnMeal$: Observable<servicebySegment[]>;
  onwardBaggage$: Observable<servicebySegment[]>;
  returnBaggage$: Observable<servicebySegment[]>;

  totalMeal$: Observable<meal[]>;
  meal$: Observable<meal[]>;
  totalBaggage$: Observable<baggage[]>;
  baggage$: Observable<baggage[]>;

  total$: Observable<any>;
  selectedService$: Observable<string>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    
    this.selectedService$ = this.store.select(FLightBookState.getSelectedService);

    this.onwardMeal$ = this.store.select(FLightBookState.getOnwardMeals);
    this.returnMeal$ = this.store.select(FLightBookState.getReturnMeals);
    this.onwardBaggage$ = this.store.select(FLightBookState.getOnwardBaggages);
    this.returnBaggage$ = this.store.select(FLightBookState.getReturnBaggages);


    // if (this.store.selectSnapshot(BookState.getBookType) == 'animated-round-trip') {
    //   this.totalMeal$ = forkJoin(this.onwardMeal$, this.returnMeal$)
    //     .pipe(
    //       map((el) => [...el[0],...el[1]]),
    //       map(el => _.uniqBy(el, 'FlightNumber')));
    //   this.meal$ = forkJoin(this.onwardMeal$, this.returnMeal$)
    //     .pipe(
    //       map((el) => [...el[0], ...el[1]])
    //     );
    //   this.totalBaggage$ = forkJoin(this.onwardBaggage$, this.returnBaggage$)
    //     .pipe(
    //       map((el) => [...el[0], ...el[1]]),
    //       map(el => _.uniqBy(el, 'FlightNumber')));
    //   this.baggage$ = forkJoin(this.onwardBaggage$, this.returnBaggage$)
    //     .pipe(
    //       map((el) => [...el[0], ...el[1]])
    //   );
      
      
    // }
    // else {
    //   this.totalMeal$ = this.onwardMeal$.pipe(map(el => _.uniqBy(el, 'FlightNumber')));
    //   this.meal$ = this.onwardMeal$;
    //   this.totalBaggage$ = this.onwardBaggage$.pipe(map(el => _.uniqBy(el, 'FlightNumber')));
    //   this.baggage$ = this.onwardBaggage$;
    // }
    
  }

  changeFlight(evt : CustomEvent) {
    console.log(evt.detail.value);
  }

}
