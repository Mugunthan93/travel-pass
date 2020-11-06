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
  localSub : string[] = [];
  otherSub : string[] = [];

  constructor(
    public modalCtrl: ModalController
    ) {

  }

  ngOnInit() {

    this.expenseForm = new FormGroup({
      travel_type: new FormControl("domestic", [Validators.required]),
      type: new FormControl("flight", [Validators.required]),
      flight : new FormGroup({
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        start_city: new FormControl(null),
        end_city: new FormControl(null),
        no_of_days: new FormControl(null)
      }),
      hotel : new FormGroup({
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        start_city: new FormControl(null),
        no_of_days: new FormControl(null)
      }),
      bus: new FormGroup({
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        start_city: new FormControl(null),
        end_city: new FormControl(null),
        no_of_days: new FormControl(null)
      }),
      train: new FormGroup({
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        start_city: new FormControl(null),
        end_city: new FormControl(null),
        no_of_days: new FormControl(null)
      }),
      food : new FormGroup({
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        start_city: new FormControl(null),
        no_of_days: new FormControl(null)
      }),
      localtravel : new FormGroup({
        start_date: new FormControl(null),
        start_city: new FormControl(null),
        end_city: new FormControl(null),
        local_travel_value : new FormControl(null),
      }),
      othertravel: new FormGroup({
        start_date: new FormControl(null),
        start_city: new FormControl(null),
        end_city: new FormControl(null),
        local_travel_value : new FormControl(null),
      }),
      cost: new FormControl(null, [Validators.required]),
      paid_by: new FormControl(null, [Validators.required])
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
    this.type.forEach(
      (type) => {
        if(evt.detail.value === type) {
          this.expenseForm.get(evt.detail.value).setValidators([ExpenseValidator()]);
          Object.keys((this.expenseForm.controls[evt.detail.value] as FormGroup).controls).forEach(
            (key) => {
              this.expenseForm.get([evt.detail.value,key]).setValidators([Validators.required]);
              this.expenseForm.get([evt.detail.value,key]).updateValueAndValidity();
              console.log(evt.detail.value,key,this.expenseForm.get([evt.detail.value,key]).errors);
            });
          this.expenseForm.get(evt.detail.value).updateValueAndValidity();
        }
        else {
          this.expenseForm.get(evt.detail.value).clearValidators();
          Object.keys((this.expenseForm.controls[evt.detail.value] as FormGroup).controls).forEach(
            (key) => {
              this.expenseForm.get([evt.detail.value,key]).clearValidators();
              this.expenseForm.get([evt.detail.value,key]).updateValueAndValidity();
              console.log(evt.detail.value,key,this.expenseForm.get([evt.detail.value,key]).errors);
            });
          this.expenseForm.get(evt.detail.value).updateValueAndValidity();
        }
        console.log(type,evt.detail.value,this.expenseForm.get(evt.detail.value).errors);
      }
      );
      console.log(this.expenseForm);
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
