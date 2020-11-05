import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseValidator } from 'src/app/validator/expense.validators';

@Component({
  selector: "app-expense",
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.scss"],
})
export class ExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  travelType: string[] = ["domestic", "international"];
  type: string[] = [
    "flight",
    "hotel",
    "bus",
    "train",
    "food",
    "localtravel",
    "othertravel",
  ];
  paid: string[] = ["paid_self", "paid_company"];

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {

    this.expenseForm = new FormGroup({
      travel_type: new FormControl("domestic", [Validators.required]),
      type: new FormControl("flight", [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date: new FormControl(null, [ExpenseValidator("end_date")]),
      start_city: new FormControl(null, [Validators.required]),
      end_city: new FormControl(null, [ExpenseValidator("end_city")]),
      no_of_days: new FormControl(null, [ExpenseValidator("no_of_days")]),
      local_travel_value: new FormControl(null, [ExpenseValidator("local_travel_value")]),
      cost: new FormControl(null, [Validators.required]),
      paid_by: new FormControl(null, [Validators.required]),
    });

  }

  customAlertOptions(header: string) {
    return {
      cssClass: "cabinClass",
      header: header,
    };
  }

  changeTravelType(evt: CustomEvent) {
    this.expenseForm.controls["travel_type"].patchValue(evt.detail.value);
  }

  changeType(evt: CustomEvent) {
    this.expenseForm.controls["type"].patchValue(evt.detail.value);
  }

  addExpense() {
    console.log(this.expenseForm);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
