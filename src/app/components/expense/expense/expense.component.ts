import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
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
  localSub : string[] = [];
  otherSub : string[] = [];

  form1 : FormGroup;
  form2 : FormGroup;
  form3 : FormGroup;

  typeChange$ : Observable<string>;

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {

    this.form1 = new FormGroup({
      start_date: new FormControl(null),
      end_date: new FormControl(null),
      start_city: new FormControl(null),
      end_city: new FormControl(null),
      no_of_days: new FormControl(null)
    });

    this.form2 = new FormGroup({
      start_date: new FormControl(null),
      end_date: new FormControl(null),
      start_city: new FormControl(null),
      no_of_days: new FormControl(null)
    });

    this.form3 = new FormGroup({
      start_date: new FormControl(null),
      start_city: new FormControl(null),
      end_city: new FormControl(null),
      local_travel_value : new FormControl(null),
    });

    this.expenseForm = new FormGroup({
      travel_type: new FormControl("domestic", [Validators.required]),
      type: new FormControl("flight", [Validators.required]),
      flight : this.form1,
      hotel : this.form2,
      bus: this.form1,
      train: this.form1,
      food : this.form2,
      localtravel : this.form3,
      othertravel: this.form3,
      cost: new FormControl(null, [Validators.required]),
      paid_by: new FormControl(null, [Validators.required]),
    });

    this.typeChange$ = this.expenseForm.get('type').valueChanges;

    this.type.forEach(
      (ty) => {
        this.expenseForm.get(ty).setAsyncValidators(ExpenseValidator(ty));
      }
    );

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

  hideItem(name : string) {
    return of(name)
      .pipe(
        withLatestFrom(this.expenseForm.get('type').valueChanges as Observable<string>),
        map(
          (str) => {
            console.log(str);
            let controlname : string = str[0];
            let type : string = str[1];

            if (type == "flight" || type == "bus" || type == "train") {
              switch (controlname) {
                  case "end_city":
                  case "end_date":
                  case "no_of_days": return false;
                  default : return true;
              }
            }
            else if (type == "hotel" || type == "food") {
              switch (controlname) {
                  case "end_date":
                  case "no_of_days": return false;
                  default : return true;
              }
            }
            else if (type == "localtravel" || type == "othertravel") {
                switch (controlname) {
                  case "end_city":
                  case "local_travel_value":return false;
                  default : return true;
              }
            }
            else {
              return true;
            }
          }
        ),
        map(
          (bool)=> {
            console.log(bool);
            return bool;
          }
        )
      );
  }

  addExpense() {
    console.log(this.expenseForm);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
