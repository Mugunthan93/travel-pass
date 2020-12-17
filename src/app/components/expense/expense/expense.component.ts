import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { Store } from '@ngxs/store';
import { buscity, city, hotelcity } from 'src/app/stores/shared.state';
import { SelectModalComponent } from '../../shared/select-modal/select-modal.component';
import { SearchMode } from 'src/app/stores/search.state';
import { DateMatchValidator } from 'src/app/validator/date_match.validators';
import { AddBill, AddExpense, EditExpense, expenselist, ExpenseState } from 'src/app/stores/expense.state';
import { TripRangeValidators } from 'src/app/validator/uniq_trip_date.Validators';
import * as moment from 'moment';

@Component({
  selector: "app-expense",
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.scss"],
})
export class ExpenseComponent implements OnInit {

  @Input() exptype : string;
  @Input() expense : expenselist;
  
  expenseForm: FormGroup;
  travelType: string[] = ["domestic", "international"];
  formtype: string[] = [
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
  localSub : string[];

  formSubmit : boolean;
  currentTrip: any;

  // flight,bus,train => start_date,end_date,start_city,end_city,no_of_days
  // hotel,food => start_date,end_date,start_city,no_of_days
  // local,other =>  start_date,start_city,end_city,local_travel_value

  constructor(
    public modalCtrl: ModalController,
    private store : Store
    ) {
  }

  ngOnInit() {

    this.currentTrip = this.store.selectSnapshot(ExpenseState.getExpenseDates);
    this.store.dispatch(new SearchMode('flight'));
    this.formSubmit = false;

    this.expenseForm = new FormGroup({
      travel_type: new FormControl("domestic", [Validators.required]),
      type: new FormControl('flight', [Validators.required]),

      start_date: new FormControl(null,[TripRangeValidators(this.currentTrip)]),
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
      paid_by: new FormControl(null, [Validators.required]),
      bills : new FormArray([])

    });

  }

  addBill() {
    this.store.dispatch(new AddBill());
  }

  ionViewDidEnter() {

    if(this.exptype == 'edit'){
      this.expenseForm.patchValue(this.expense);
    }

    this.expenseForm.get('start_date').setValidators(DateMatchValidator('start_date','end_date'));
    this.changeValidation('flight');
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

  changeSubType(evt: CustomEvent) {
    this.expenseForm.controls["local_travel_value"].patchValue(evt.detail.value);
  }

  changeType(evt: CustomEvent) {
    this.expenseForm.controls["type"].patchValue(evt.detail.value);
    if(evt.detail.value == 'flight' || evt.detail.value == 'hotel' || evt.detail.value == 'bus') {
      this.store.dispatch(new SearchMode(evt.detail.value));
    }

    this.changeValidation(evt.detail.value);

    this.expenseForm.patchValue({
      travel_type: this.expenseForm.get('travel_type').value,
      type: this.expenseForm.get('type').value,

      start_date: null,
      start_city: null,
      end_date: null,
      end_city: null,
      no_of_days: null,
      local_travel_value : null,

      cost: this.expenseForm.get('cost').value,
      paid_by: this.expenseForm.get('paid_by').value
    });
    console.log(this.expenseForm);
  }

  changeValidation(value: string) {

    if(value == 'flight' || value == 'bus' || value == 'train')  {
      this.expenseForm.controls['end_date'].setValidators([TripRangeValidators(this.currentTrip),DateMatchValidator('start_date','end_date')]);
      this.expenseForm.controls['end_city'].setValidators(Validators.required);
      this.expenseForm.controls['no_of_days'].setValidators(Validators.required);
      this.expenseForm.controls['local_travel_value'].clearValidators();
    }
    else if(value == 'hotel' || value == 'food') {
      this.expenseForm.controls['end_date'].setValidators([TripRangeValidators(this.currentTrip),DateMatchValidator('start_date','end_date')]);
      this.expenseForm.controls['no_of_days'].setValidators(Validators.required);
      this.expenseForm.controls['end_city'].clearValidators();
      this.expenseForm.controls['local_travel_value'].clearValidators();
    }
    else if(value == 'localtravel' || value == 'othertravel') {
      this.expenseForm.controls['end_city'].setValidators(Validators.required);
      this.expenseForm.controls['local_travel_value'].setValidators(Validators.required);
      this.expenseForm.controls['end_date'].clearValidators();
      this.expenseForm.controls['no_of_days'].clearValidators();
      if(value == 'localtravel') {
        this.localSub = ["cab","bus","train","auto"];
      }
      else if(value == "othertravel") {
        this.localSub =  ["fuel","internet","forex","callingcard","client_entertainment","miscellaneous"];
      }
    }
    
  }

  hideItem(name : string) {
    switch(name) {
      case "end_city" : return !this.endcity.some(el => el === this.expenseForm.controls["type"].value);
      case "end_date" : return !this.enddate.some(el => el === this.expenseForm.controls["type"].value);
      case "no_of_days" : return !this.days.some(el => el === this.expenseForm.controls["type"].value);
      case "local_travel_value" : return !this.localother.some(el => el === this.expenseForm.controls["type"].value);
    }
  }

  async getCity(field : string) {

    let type : string = this.expenseForm.get('type').value;
    console.log(field,type);
    if(type == 'flight' || type == 'hotel' || type == 'bus') {

      const modal = await this.modalCtrl.create({
        component: SelectModalComponent,
        componentProps: {
          title: 'city'
        },
      });
  
      modal.onDidDismiss().then(
        (selectedCity) => {
          if (selectedCity.role == "backdrop") {
            return;
          }

          console.log(type,selectedCity);

          if(selectedCity.data !== null) {

            if(type == 'flight') {
              let flightcity : city = selectedCity.data;
              this.expenseForm.controls[field].patchValue(flightcity.city_name);
            }
            else if(type == 'hotel') {
              let hotlcity : hotelcity = selectedCity.data;
              this.expenseForm.controls[field].patchValue(hotlcity.destination);
            }
            else if(type == 'bus') {
              let hotlcity : buscity = selectedCity.data;
              this.expenseForm.controls[field].patchValue(hotlcity.station_name);
            }
          }


        }
      );
  
      return await modal.present();
    }
    else {
      return;
    }

  }

  addExpense() {
    this.formSubmit = true;
    console.log(this.expenseForm);

    if(this.exptype == 'add') {
      this.store.dispatch(new AddExpense(this.expenseForm.value));
    }
    else if(this.exptype == 'edit') {
      let currentExpense = Object.assign(this.expense,this.expenseForm.value);
      this.store.dispatch(new EditExpense(currentExpense));
    }

  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
