import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { DeleteExpense, DeselectExpense, expenselist, ExpenseState, SelectExpense, SelectState, SendExpense, triplist } from 'src/app/stores/expense.state';
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
  selectdisable$ : Observable<boolean>;
  tripType$ : Observable<string>;
  sendExp$: Observable<expenselist[]>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController,
    public popoverCtrl : PopoverController
  ) { }

  ngOnInit() {

    this.currentTrip$ = this.store.select(ExpenseState.getCurrentTrip);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
    this.selectdisable$ = this.store.select(ExpenseState.SelectDisable);
    this.tripType$ = this.store.select(ExpenseState.getTripType);

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
    this.sendExp$ = this.store.select(ExpenseState.getSendExp);
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

    if(exp.paid_by == 'paid_company' || exp.status !== 'new') {
      return;
    }
    else {
      const popover = await this.popoverCtrl.create({
        component : ExpenseEditComponent,
        componentProps : {
          expense : exp,
          exptype : 'edit'
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
    if(evt.detail.checked) {
      this.store.dispatch(new SelectExpense(evt.detail.value));
    }
    else {
      this.store.dispatch(new DeselectExpense(evt.detail.value));
    }
  }

  disableExpense(e : expenselist) : boolean {
    let status = ['new','review','manager_rejected'];
    return !status.includes(e.status); 
  }

  sendExpense(status : string) {
    this.store.dispatch(new SendExpense(status));
  }

  deleteExpense(exp : any[]) {
    let explist : expenselist[] = exp.reduce(
      (acc,curr) => {
        console.log(acc,curr);
        return [...curr.value];
      },[]
    );
    console.log(explist);
    let number : number[] = explist.map(el => el.id);
    this.store.dispatch(new DeleteExpense(number));
  }

  status(exp : expenselist) : string {
    switch(exp.status) {
      case 'new' : return 'new';
      case 'manager_approved' : return 'approved';
      case 'manager_rejected': return 'rejected';
      case 'review' : return 'review';
    }
  }

  showOptions(exp : expenselist) : Observable<boolean> {

    return combineLatest([this.enableExp$,this.tripType$])
      .pipe(
        map(
          (options) => {
            let enable = options[0];
            let tripType = options[1];
            return !(enable) && (exp.paid_by == 'paid_self' && exp.status == 'new') && (tripType == 'mytrips')
          }
        )
        );
  }

  checked(e : expenselist) : Observable<boolean> {
    return this.sendExp$
      .pipe(
        map(
          (exp : expenselist[]) => {
            return exp.some(el => _.isEqual(el,e));
          }
        )
      );
  }

  back() {
    this.store.dispatch([
      new SelectState(false),
      new Navigate(["/", "home", "dashboard", "expense-tab"])
    ]);
  }
}
