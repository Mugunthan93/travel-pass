import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ExpenseState, GetExpenseList, triplist } from 'src/app/stores/expense.state';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.page.html',
  styleUrls: ['./expense-tab.page.scss'],
})
export class ExpenseTabPage implements OnInit {

  trips$ : Observable<triplist[]>;

  constructor(
    public modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.trips$ = this.store.select(ExpenseState.getTripList);
  }

  getExpense(trip : triplist) {
    this.store.dispatch(new GetExpenseList(trip));
  }

}
