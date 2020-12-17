import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { expenselist } from 'src/app/stores/expense.state';
import { ExpenseComponent } from '../expense/expense.component';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss'],
})
export class ExpenseEditComponent implements OnInit {

  @Input() expense : expenselist;

  constructor(
    public popoverCtrl : PopoverController,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {}

  async editExpense() {
    const modal = await this.modalCtrl.create({
      component: ExpenseComponent,
      componentProps : {
        expense : this.expense,
        exptype : 'edit'
      },
      id: "expense",
    });

    if(this.popoverCtrl) {
      await this.popoverCtrl.dismiss(null,null,'get-expense');
    }

    return await modal.present();
  }

}
