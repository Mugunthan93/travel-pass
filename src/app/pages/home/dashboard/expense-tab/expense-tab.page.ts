import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
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

  trips$ : Observable<triplist[] | number[]>;
  expenses$ : Observable<expenselist[]>;
  loading$ : Observable<boolean>;
  progress$ : Observable<number>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
    this.loading$ = this.store.select(ExpenseState.getLoading);

    this.progress$ = combineLatest([this.totalpaid(),this.totalCost()])
      .pipe(
        map(
          (exp) => {
            if(exp[1] == 0) {
              return 1;
            }
            else {
              console.log(exp);
              let paid = exp[0];
              let cost = exp[1];
              return paid/cost;
            }
          }
        )
      );
      
  }

  tripTotalCost(trip : triplist) : Observable<number> {
    return this.expenses$
      .pipe(
        map(exp => exp.filter(ex => ex.trip_id == trip.id)),
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

  tripReImbursableCost(trip : triplist) : Observable<number> {
    return this.expenses$
      .pipe(
        map(exp => exp.filter(ex => ((ex.trip_id == trip.id) && (ex.paid_by !== 'paid_company')))),
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

  totalCost() {
    return this.expenses$
    .pipe(
      map(exp => _.uniqBy(exp,'id')),
      map(
        (filtered) => {
          let reduced = filtered.reduce((acc,curr) => {
            return acc + curr.cost;
          },0);
          return reduced;
        }
      )
    )
  }

  totalpaid() {
    return this.expenses$
    .pipe(
      map(exp => _.uniqBy(exp,'id').filter(el => el.paid_by == 'paid_company')),
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

  totalBalance() {
    return this.expenses$
    .pipe(
      map(exp => _.uniqBy(exp,'id').filter(el => el.paid_by !== 'paid_company')),
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

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
