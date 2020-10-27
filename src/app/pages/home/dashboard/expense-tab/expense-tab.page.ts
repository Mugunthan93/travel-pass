import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpenseState, GetExpenseList, triplist } from 'src/app/stores/expense.state';
import * as moment from 'moment';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.page.html',
  styleUrls: ['./expense-tab.page.scss'],
})
export class ExpenseTabPage implements OnInit {

  trips$ : Observable<triplist[]>;
  startDate$ : Observable<moment.Moment>;
  endDate$ : Observable<moment.Moment>;

  @ViewChild('start',{ static : true,read : IonInput}) start : IonInput;
  @ViewChild('end',{ static : true,read : IonInput}) end : IonInput;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
    this.startDate$ = this.store.select(ExpenseState.getStartDate);
    this.endDate$ = this.store.select(ExpenseState.getEndDate);
    console.log(this.start,this.end);
  }

  startDate() {
    return this.startDate$.pipe(
      map(
        (date) => {
          this.start.value = date.format('DD/MM/YYYY');
          return date.format('DD/MM/YYYY');
        }
      )
    );
  }

  endDate() {
    return this.endDate$.pipe(
      map(
        (date) => {
          this.end.value = date.format('DD/MM/YYYY');
          return date.format('DD/MM/YYYY');
        }
      )
    );
  }

  startChange(evt : CustomEvent) {
    console.log(evt);
  }

  endChange(evt : CustomEvent) {
    console.log(evt);
  }

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
