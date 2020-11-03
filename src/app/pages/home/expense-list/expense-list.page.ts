import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { expenselist, ExpenseState, triplist } from 'src/app/stores/expense.state';
import * as _ from 'lodash';
import * as moment from 'moment';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrls: ['./expense-list.page.scss'],
})
export class ExpenseListPage implements OnInit {

  expenses$ : Observable<expenselist[]>;
  expensesList$ : Observable<any[]>;
  currentTrip$ : Observable<triplist>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.currentTrip$ = this.store.select(ExpenseState.getCurrentTrip);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
    this.expensesList$ = this.expenses$
      .pipe(
        withLatestFrom(this.currentTrip$),
        map(
          (exp) => {
            let expense = exp[0];
            let currentTrip = exp[1];
            let grpedExpense = _.chain(expense)
              .filter(exparr => exparr.trip_id == currentTrip.id)
              .groupBy('type')
              .map((val,key) => {
                return {
                  type : key,
                  total : _.reduce(val,(acc,curr) => {
                    return acc + curr.cost;
                  },0),
                  value : _.chain(val)
                  .sortBy(o => moment(o.start_date))
                  .groupBy('start_date')
                  .map((val,key) => {
                    return {
                      date : key,
                      value : val
                    }
                  })
                  .value()
                }
              })
              .value();
            console.log(grpedExpense);
            return grpedExpense;
          }
        )
      );
  }

  paidBy(exp : expenselist) {
    switch(exp.paid_by) {
      case 'paid_company' : return 'Company';
    }
  }

  totalCost() : Observable<number> {
    return combineLatest([this.expenses$,this.currentTrip$])
      .pipe(
        map(exp => exp[0].filter(ex => ex.trip_id == exp[1].id)),
        map(
          (filtered) => {
            console.log(filtered);
            let reduced = filtered.reduce((acc,curr) => {
              return acc + curr.cost;
            },0);
            console.log(reduced);
            return reduced;
          }
        )
      );
  }

  back() {
    this.store.dispatch(new Navigate(['/','home','dashboard','expense-tab']));
  }

}
