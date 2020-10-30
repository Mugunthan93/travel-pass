import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseState, GetExpenseList, triplist } from 'src/app/stores/expense.state';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.page.html',
  styleUrls: ['./expense-tab.page.scss'],
})
export class ExpenseTabPage implements OnInit {

  trips$ : Observable<triplist[]>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
  }

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
