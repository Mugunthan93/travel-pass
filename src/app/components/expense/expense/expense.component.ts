import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
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

  endcity : string[] = ["flight","bus","train","localtravel","othertravel"];
  enddate : string[] = ["flight","bus","train","hotel","food"];
  days : string[] = ["flight","bus","train","hotel","food"];
  localother : string[] =["localtravel","othertravel"];

  localSub : string[] = [];
  otherSub : string[] = [];

  // flight,bus,train => start_date,end_date,start_city,end_city,no_of_days
  // hotel,food => start_date,end_date,start_city,no_of_days
  // local,other =>  start_date,start_city,end_city,local_travel_value

  constructor(
    public modalCtrl: ModalController
    ) {

  }

  ngOnInit() {

    this.expenseForm = new FormGroup({
      travel_type: new FormControl("domestic", [Validators.required]),
      type: new FormControl(null, [Validators.required]),

      start_date: new FormControl(null,[Validators.required]),
      start_city: new FormControl(null,[Validators.required]),

      //flight,bus,train,hotel,food
      end_date: new FormControl(null),

      //flight,bus,train,local,other
      end_city: new FormControl(null),

      //flight,bus,train,hotel,food
      no_of_days: new FormControl(null),

      //local,other
      local_travel_value : new FormControl(null),

      cost: new FormControl(null, [Validators.required]),
      paid_by: new FormControl(null, [Validators.required])
    });

    this.expenseForm.get('end_date').setAsyncValidators(ExpenseValidator(this.enddate));
    this.expenseForm.get('end_city').setAsyncValidators(ExpenseValidator(this.endcity));
    this.expenseForm.get('no_of_days').setAsyncValidators(ExpenseValidator(this.days));
    this.expenseForm.get('local_travel_value').setAsyncValidators(ExpenseValidator(this.localother));

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
    console.log(this.expenseForm);
  }

  hideItem(name : string) {
    switch(name) {
      case "end_city" : return !this.endcity.some(el => el === this.expenseForm.get("type").value);
      case "end_date" : return !this.enddate.some(el => el === this.expenseForm.get("type").value);
      case "no_of_days" : return !this.days.some(el => el === this.expenseForm.get("type").value);
      case "local_travel_value" : return !this.localother.some(el => el === this.expenseForm.get("type").value);
    }
  }

  addExpense() {
    console.log(this.expenseForm);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
