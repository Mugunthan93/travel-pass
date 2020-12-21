import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { DeleteExpense, expenselist, ExpenseState, SelectState, SendExpense, triplist } from 'src/app/stores/expense.state';
import * as _ from 'lodash';
import * as moment from 'moment';
import { map, withLatestFrom } from 'rxjs/operators';
import { ModalController, PopoverController } from '@ionic/angular';
import { ExpenseComponent } from 'src/app/components/expense/expense/expense.component';
import { ExpenseEditComponent } from 'src/app/components/expense/expense-edit/expense-edit.component';

@Component({
  selector: "app-expense-list",
  templateUrl: "./expense-list.page.html",
  styleUrls: ["./expense-list.page.scss"],
})
export class ExpenseListPage implements OnInit {

  expenses$: Observable<expenselist[]>;
  expensesList$: Observable<any[]>;
  currentTrip$: Observable<triplist>;

  enableExp$ : Observable<boolean>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController,
    public popoverCtrl : PopoverController
  ) { }

  ngOnInit() {

    this.currentTrip$ = this.store.select(ExpenseState.getCurrentTrip);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);

    this.expensesList$ = this.expenses$.pipe(
      withLatestFrom(this.currentTrip$),
      map((exp) => {
        let expense = exp[0];
        let currentTrip = exp[1];
        let grpedExpense = _.chain(expense)
          .filter((exparr) => exparr.trip_id == currentTrip.id)
          .groupBy("type")
          .map((val, key) => {
            return {
              type: key,
              total: _.reduce(
                val,
                (acc, curr) => {
                  return acc + curr.cost;
                },
                0
              ),
              value: _.chain(val)
                .sortBy((o) => moment(o.start_date))
                .groupBy("start_date")
                .map((val, key) => {
                  let date = key == 'null' ? val[0].createdAt : key;
                  return {
                    date: date,
                    value: val,
                  };
                })
                .sortBy((o) => moment(o.date))
                .value(),
            };
          })
          .value();
        console.log(grpedExpense);
        return grpedExpense;
      })
    );
    this.enableExp$ = this.store.select(ExpenseState.getSelectState);
  }

  async addExpense() {
    const modal = await this.modalCtrl.create({
      component: ExpenseComponent,
      componentProps : {
        expense : null,
        exptype : 'add'
      },
      id: "expense",
    });
    return await modal.present();
  }

  async getExpense(ev : CustomEvent, exp : expenselist) {

    if(exp.paid_by == 'paid_company') {
      return;
    }
    else {
      const popover = await this.popoverCtrl.create({
        component : ExpenseEditComponent,
        componentProps : {
          expense : exp,
          exptype : 'add'
        },
        event: ev,
        cssClass : 'get-expense',
        animated : false,
        id: 'get-expense'
      });
      return await popover.present();
    }

  }

  paidBy(exp: expenselist) {
    switch (exp.paid_by) {
      case "paid_company":
        return "Company";
    }
  }

  totalCost(): Observable<number> {
    return combineLatest([this.expenses$, this.currentTrip$]).pipe(
      map((exp) => exp[0].filter((ex) => ex.trip_id == exp[1].id)),
      map((filtered) => {
        let reduced = filtered.reduce((acc, curr) => {
          return acc + curr.cost;
        }, 0);
        return reduced;
      })
    );
  }

  changeState(state : boolean) {
    this.store.dispatch(new SelectState(state));
  }

  selectExpense(evt : CustomEvent) {
    console.log(evt);
  }

  sendExpense() {
    this.store.dispatch(new SendExpense());
  }

  deleteExpense(exp : expenselist[]) {
    this.store.dispatch(new DeleteExpense(exp));
  }

  back() {
    this.store.dispatch(
      new Navigate(["/", "home", "dashboard", "expense-tab"])
    );
  }
}
