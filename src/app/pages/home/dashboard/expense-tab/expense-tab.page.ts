import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ChangeTripType, expenselist, ExpenseState, GetExpenseList, GetProjectList, triplist } from 'src/app/stores/expense.state';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { map, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
import { EligibilityState, gradeValue } from 'src/app/stores/eligibility.state';
import { TripComponent } from 'src/app/components/expense/trip/trip.component';
import { UserState } from 'src/app/stores/user.state';

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
  domesticEligibility$ : Observable<gradeValue>;
  intEligibility$ : Observable<gradeValue>;
  tripType$ : Observable<string>;
  isManager$ : Observable<boolean>;

  totalAdvance$ : Observable<number>;
  totalExpense$ : Observable<number>;


  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
    this.loading$ = this.store.select(ExpenseState.getLoading);

    this.totalAdvance$ = this.store.select(ExpenseState.getTotalAdvance);
    this.totalExpense$ = this.store.select(ExpenseState.getTotalExpense);

    this.domesticEligibility$ = this.store.select(EligibilityState.getDomestic);
    this.intEligibility$ = this.store.select(EligibilityState.getInternational);

    this.tripType$ = this.store.select(ExpenseState.getTripType);
    this.progress$ = combineLatest([this.totalSpent(),this.totalSaving()])
      .pipe(
        map(
          (exp) => {
            let spent = exp[0];
            let save = exp[1];
            if(spent == 0) {
              return 0;
            }
            else if(save == 0) {
              return 1;
            }
            else {
              return spent/(spent + save);
            }
          }
        )
      );
    
    this.isManager$ = this.store.select(UserState.isManager);
      
  }

  tripChange(evt : CustomEvent) {
    this.store.dispatch(new ChangeTripType(evt.detail.value));
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
    return this.expenses$.pipe(
      map((exp) =>
        exp.filter((ex) => ex.trip_id == trip.id && ex.paid_by == "paid_self")
      ),
      withLatestFrom(this.domesticEligibility$, this.intEligibility$),
      map((filtered) => {
        let domesticCost = filtered[1];
        let intCost = filtered[2];

        let reduced = filtered[0].reduce((acc, curr) => {
          let currentTotal = null;

          if (
            curr.travel_type == "domestic" &&
            domesticCost[curr.type] < curr.cost
          ) {
            let spent = curr.cost - domesticCost[curr.type];
            currentTotal = acc + spent;
          } else if (
            curr.travel_type == "international" &&
            intCost[curr.type] < curr.cost
          ) {
            let spent = curr.cost - intCost[curr.type];
            currentTotal = acc + spent;
          } else {
            currentTotal = acc + 0;
          }
          return currentTotal;
        }, 0);
        return reduced;
      })
    );
  }

  totalCost() : Observable<number> {
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

  totalSpent() : Observable<number> {
    return this.expenses$.pipe(
      map((exp) => _.uniqBy(exp, "id")),
      map((exp) => exp.filter((ex) => ex.paid_by == "paid_self")),
      withLatestFrom(this.domesticEligibility$, this.intEligibility$),
      map((filtered) => {
        let domesticCost = filtered[1];
        let intCost = filtered[2];

        let paid = filtered[0].reduce((acc, curr) => {
          let currentTotal = null;

          if (curr.travel_type == "domestic" && domesticCost[curr.type] < curr.cost) {
            let spent = curr.cost - domesticCost[curr.type];
            currentTotal = acc + spent;
          }
          else if (curr.travel_type == "international" && intCost[curr.type] < curr.cost) {
            let spent = curr.cost - intCost[curr.type];
            currentTotal = acc + spent;
          }
          else {
            currentTotal = acc + 0;
          }
          return currentTotal;
        }, 0);

        return paid;

        // let reduced = filtered[0].reduce((acc,curr) => {
        //   return acc + curr.cost;
        // },0);
        // return reduced;
      })
    );
  }

  totalSaving() {
    return this.expenses$
    .pipe(
      map(exp => _.uniqBy(exp,'id')),
      map(exp => exp.filter(ex => ex.paid_by == 'paid_company')),
      withLatestFrom(this.domesticEligibility$,this.intEligibility$),
      map(
        (filtered) => {
          let domesticCost = filtered[1];
          let intCost = filtered[2];
          let paid = filtered[0].reduce(
            (acc,curr) => {
              let currentTotal = null;

              if(curr.travel_type == 'domestic' && (domesticCost[curr.type] > curr.cost)) {
                let spent = domesticCost[curr.type] - curr.cost;
                currentTotal = acc + spent;
              }
              else if(curr.travel_type == 'international' && (intCost[curr.type] > curr.cost)) {
                let spent = intCost[curr.type] - curr.cost;
                currentTotal = acc + spent;
              }
              else {
                currentTotal = acc + 0;
              }
              return currentTotal;
            },0
          );
          return paid;
        }
      )
    );
  }

  async addTrip() {
    const modal = await this.modalCtrl.create({
      component: TripComponent,
      id: 'trip'
    });
    this.store.dispatch(new GetProjectList(modal));
  }

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
