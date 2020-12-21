import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { Store } from '@ngxs/store';
import { buscity, city, hotelcity } from 'src/app/stores/shared.state';
import { SelectModalComponent } from '../../shared/select-modal/select-modal.component';
import { SearchMode } from 'src/app/stores/search.state';
import { DateMatchValidator } from 'src/app/validator/date_match.validators';
import { AddExpense, EditExpense, expenselist, ExpenseState } from 'src/app/stores/expense.state';
import { TripRangeValidators } from 'src/app/validator/uniq_trip_date.Validators';
import * as moment from 'moment';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilePath } from '@ionic-native/file-path/ngx';

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

  bills : FormArray;

  formSubmit : boolean;
  currentTrip: any;

  // flight,bus,train => start_date,end_date,start_city,end_city,no_of_days
  // hotel,food => start_date,end_date,start_city,no_of_days
  // local,other =>  start_date,start_city,end_city,local_travel_value

  constructor(
    public modalCtrl: ModalController,
    public fb : FormBuilder,
    private store : Store,
    private fileChooser : FileChooser,
    private filePath : FilePath
    ) {
  }

  ngOnInit() {

    this.currentTrip = this.store.selectSnapshot(ExpenseState.getExpenseDates);
    this.store.dispatch(new SearchMode('flight'));
    this.formSubmit = false;

    this.expenseForm = this.fb.group({
      travel_type: this.fb.control("domestic", [Validators.required]),
      type: this.fb.control('flight', [Validators.required]),

      start_date: this.fb.control(null,{
        validators : [TripRangeValidators(this.currentTrip)],
        updateOn : 'change'
      }),
      start_city: this.fb.control(null,[Validators.required]),

      //flight,bus,train,hotel,food
      end_date: this.fb.control(null,{
        updateOn : 'change'
      }),

      //flight,bus,train,local,other
      end_city: this.fb.control(null),

      //flight,bus,train,hotel,food
      no_of_days: this.fb.control(null),

      //local,other
      local_travel_value : this.fb.control(null),

      cost: this.fb.control(null, [Validators.required]),
      paid_by: this.fb.control(null, [Validators.required]),
      attachementpath : this.fb.group({
        bills : new FormArray([])
      })

    });

    this.bills = this.expenseForm.get('attachementpath.bills') as FormArray;

    // this.expenseForm.get('start_date').setValidators(DateMatchValidator('start_date','end_date'));
    this.changeValidation('flight');
  }

  billArray() {
    return this.expenseForm.get('attachementpath.bills').value;
  }

  async addBill() {
    console.log(this.fileChooser);
    let url = await this.fileChooser.open();
    let URL = await this.filePath.resolveNativePath(url);
    let UrlSegment = URL.split('/');
    let name = UrlSegment[UrlSegment.length - 1];
    this.bills.push(this.createBill(url,name));
  }

  createBill(url : string, name : string) {
    return this.fb.group({
      url:this.fb.control(url),
      name: this.fb.control(name)
    });
  }

  deleteBill(i : number) {
    this.bills.removeAt(i);
  }

  ionViewDidEnter() {
    if(this.exptype == 'edit'){
      this.expenseForm.patchValue(this.expense);
    }
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
      this.expenseForm.controls['start_date'].setValidators([TripRangeValidators(this.currentTrip),DateMatchValidator('start_date','end_date')]);
      this.expenseForm.controls['end_date'].setValidators([TripRangeValidators(this.currentTrip),DateMatchValidator('start_date','end_date')]);
      this.expenseForm.controls['end_city'].setValidators(Validators.required);
      this.expenseForm.controls['no_of_days'].setValidators(Validators.required);
      this.expenseForm.controls['local_travel_value'].clearValidators();
    }
    else if(value == 'hotel' || value == 'food') {
      this.expenseForm.controls['start_date'].setValidators([TripRangeValidators(this.currentTrip),DateMatchValidator('start_date','end_date')]);
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

    this.expenseForm.updateValueAndValidity({
      emitEvent : false
    });
    
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
    if(type == 'flight' || type == 'hotel' || type == 'bus' || type == 'train') {

      let currentTitle = (type == 'train') ? 'Station' : 'city'; 
      let props = {
        title: currentTitle,
        category: this.expenseForm.get('travel_type').value
      }
      console.log(props);

      const modal = await this.modalCtrl.create({
        component: SelectModalComponent,
        componentProps: props,
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
            else if(type == 'bus' || type == 'train') {
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

    this.expenseForm.get('start_date').updateValueAndValidity();
    if(this.expenseForm.valid) {
      if(this.exptype == 'add') {
        this.store.dispatch(new AddExpense(this.expenseForm.value));
      }
      else if(this.exptype == 'edit') {
        let currentExpense = Object.assign(this.expense,this.expenseForm.value);
        this.store.dispatch(new EditExpense(currentExpense));
      }
    }


  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
