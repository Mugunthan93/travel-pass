import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, from, Observable } from 'rxjs';
import { expenselist, ExpenseState, triplist } from 'src/app/stores/expense.state';
import * as _ from 'lodash';
import { flatMap, groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrls: ['./expense-list.page.scss'],
})
export class ExpenseListPage implements OnInit {

  expenses$ : Observable<any[]>;
  currentTrip$ : Observable<triplist>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.currentTrip$ = this.store.select(ExpenseState.getCurrentTrip);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList)
      .pipe(
        flatMap(exp => from(exp)),
        groupBy(exp => exp.type),
        mergeMap(group$ =>
          group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))
        ),
        map(
          (exp) => {
            console.log(exp);
            return exp;
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
            let reduced = filtered.reduce((acc,curr) => {
              return acc + curr.cost;
            },0);
            return reduced;
          }
        )
      );
  }

  back() {
    this.store.dispatch(new Navigate(['/','home','dashboard','expense-tab']));
  }

}
