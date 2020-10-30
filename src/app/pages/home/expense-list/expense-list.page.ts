import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { expenselist, ExpenseState } from 'src/app/stores/expense.state';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrls: ['./expense-list.page.scss'],
})
export class ExpenseListPage implements OnInit {

  expenses$ : Observable<expenselist[]>;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {
    this.expenses$ = this.store.select(ExpenseState.getExpenseList);
  }

  paidBy(exp : expenselist) {
    switch(exp.paid_by) {
      case 'paid_company' : return 'Company';
    }
  }

  back() {
    this.store.dispatch(new Navigate(['/','home','dashboard','expense-tab']));
  }

}
