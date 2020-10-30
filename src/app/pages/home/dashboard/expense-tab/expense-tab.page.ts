import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { expenselist, ExpenseState, GetExpenseList, triplist } from 'src/app/stores/expense.state';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { map, reduce } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.page.html',
  styleUrls: ['./expense-tab.page.scss'],
})
export class ExpenseTabPage implements OnInit {

  trips$ : Observable<triplist[]>;
  expenses$ : Observable<expenselist[]>;
  loading$ : Observable<boolean>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
    this.loading$ = this.store.select(ExpenseState.getLoading);
  }

  totalCost(trip : triplist) : Observable<number> {
    return this.expenses$
      .pipe(
        map(exp => exp.filter(ex => ex.trip_id == trip.id)),
        reduce((acc,curr,ind) => {
          console.log(acc,curr,ind);
          // return _.isUndefined(curr[ind].cost) ? acc + 0 : acc + curr[ind].cost
          return 0;
        },0)
      );
  }

  reImbursableAmount(trip : triplist) : Observable<number> {
    return this.expenses$
      .pipe(
        map(exp => exp.filter(ex => ((ex.trip_id == trip.id) && (ex.paid_by !== 'paid_company')))),
        reduce((acc,curr,ind) => {
          console.log(acc,curr,ind);
          // return _.isUndefined(curr[ind].cost) ? acc + 0 : acc + curr[ind].cost
          return 0;
        },0)
      );
  }

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
