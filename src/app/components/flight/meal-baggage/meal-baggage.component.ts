import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, concat } from 'rxjs';
import { FLightBookState, SelectService, meal, baggage, SetVeg, SetNonVeg, servicebySegment } from 'src/app/stores/book/flight.state';
import { map } from 'lodash';
import * as _ from 'lodash';
import { BookState } from 'src/app/stores/book.state';

@Component({
  selector: 'app-meal-baggage',
  templateUrl: './meal-baggage.component.html',
  styleUrls: ['./meal-baggage.component.scss'],
})
export class MealBaggageComponent implements OnInit {

  type: string = null; 

  meals: any[] = ["1", "2", "3", "4", "5"];
  baggages: any[] = ["1", "2", "3", "4", "5"];

  onwardMeal$: Observable<servicebySegment[]>;
  returnMeal$: Observable<servicebySegment[]>;
  onwardBaggage$: Observable<servicebySegment[]>;
  returnBaggage$: Observable<servicebySegment[]>;

  totalMeal$: Observable<servicebySegment[]>;
  totalBaggage$: Observable<servicebySegment[]>;

  total$: Observable<any>;

  selectedService$: Observable<string>; 
  veg$: Observable<boolean>;
  nonveg$: Observable<boolean>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.selectedService$ = this.store.select(FLightBookState.getSelectedService);
    this.veg$ = this.store.select(FLightBookState.getVeg);
    this.nonveg$ = this.store.select(FLightBookState.getNonVeg);


    this.onwardMeal$ = this.store.select(FLightBookState.getOnwardMeals);
    this.returnMeal$ = this.store.select(FLightBookState.getReturnMeals);
    this.onwardBaggage$ = this.store.select(FLightBookState.getOnwardBaggages);
    this.returnBaggage$ = this.store.select(FLightBookState.getReturnBaggages);


    if (this.store.selectSnapshot(BookState.getBookType) == 'animated-round-trip') {
      this.totalMeal$ = concat(this.onwardMeal$, this.returnMeal$);
      this.totalBaggage$ = concat(this.onwardBaggage$, this.returnBaggage$);
    }
    else {
      this.totalMeal$ = this.onwardMeal$;
      this.totalBaggage$ = this.onwardBaggage$;
    }
  }
  
  dismissMeal() {
    this.modalCtrl.dismiss(null,null,'passenger-meal');
  }

  change(type : CustomEvent) {
    this.store.dispatch(new SelectService(type.detail.value));
  }

  checkVeg(check: CustomEvent) {
    console.log(check);
    this.store.dispatch(new SetVeg(check.detail.checked));
  }

  checkNonVeg(check: CustomEvent) {
    console.log(check);
    this.store.dispatch(new SetNonVeg(check.detail.checked));
  }

}
