import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { Store } from '@ngxs/store';
import { buscity, city, hotelcity } from 'src/app/stores/shared.state';
import { SelectModalComponent } from '../../shared/select-modal/select-modal.component';
import { SearchMode } from 'src/app/stores/search.state';
import { DateMatchValidator } from 'src/app/validator/date_match.validators';
import { AddExpense, bill, EditExpense, expenselist, ExpenseState } from 'src/app/stores/expense.state';
import { TripRangeValidators } from 'src/app/validator/uniq_trip_date.Validators';
import * as moment from 'moment';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { File } from '@ionic-native/file/ngx';
import { ExpenseCostValidator } from 'src/app/validator/expense_cost.validators';
import { EligibilityState, gradeValue } from 'src/app/stores/eligibility.state';

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
  getDomesticEligibility: gradeValue;
  getIntEligibility: gradeValue;

  // flight,bus,train => start_date,end_date,start_city,end_city,no_of_days
  // hotel,food => start_date,end_date,start_city,no_of_days
  // local,other =>  start_date,start_city,end_city,local_travel_value

  constructor(
    public modalCtrl: ModalController,
    public fb : FormBuilder,
    private store : Store,
    private fileChooser : FileChooser,
    private filePath : FilePath,
    private fileTransfer : FileTransfer,
    private file : File
    ) {
  }

  ngOnInit() {

    this.currentTrip = this.store.selectSnapshot(ExpenseState.getExpenseDates);
    this.getDomesticEligibility = this.store.selectSnapshot(EligibilityState.getDomestic);
    this.getIntEligibility = this.store.selectSnapshot(EligibilityState.getInternational);
    this.formSubmit = false;

    if(this.exptype == 'add') {
      this.store.dispatch(new SearchMode('flight'));

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

        cost: this.fb.control(null, [Validators.required,ExpenseCostValidator.bind(this,this.getDomesticEligibility,this.getIntEligibility)]),
        paid_by: this.fb.control(null, [Validators.required]),
        attachementpath : this.fb.group({
          bills : new FormArray([])
        })

      });

      this.changeValidation('flight');

    }
    else if(this.exptype == 'edit'){

      this.store.dispatch(new SearchMode(this.expense.type));

      this.expenseForm = this.fb.group({
        travel_type: this.fb.control(this.expense.travel_type, [Validators.required]),
        type: this.fb.control(this.expense.type, [Validators.required]),

        start_date: this.fb.control(moment(this.expense.start_date).format('YYYY-MM-DD'),{
          validators : [TripRangeValidators(this.currentTrip)],
          // updateOn : 'submit'
        }),
        start_city: this.fb.control(this.expense.start_city,[Validators.required]),

        //flight,bus,train,hotel,food
        end_date: this.fb.control(moment(this.expense.end_date).format('YYYY-MM-DD'),{
          // updateOn : 'submit'
        }),

        //flight,bus,train,local,other
        end_city: this.fb.control(this.expense.end_city),

        //flight,bus,train,hotel,food
        no_of_days: this.fb.control(this.expense.no_of_days),

        //local,other
        local_travel_value : this.fb.control(this.expense.local_travel_value),

        cost: this.fb.control(this.expense.cost, [Validators.required,ExpenseCostValidator.bind(this,this.getDomesticEligibility,this.getIntEligibility)]),
        paid_by: this.fb.control(this.expense.paid_by, [Validators.required]),
        attachementpath : this.fb.group({
          bills : new FormArray([])
        })

      });

      this.changeValidation(this.expense.type);

    }

    this.bills = this.expenseForm.get('attachementpath.bills') as FormArray;

    if(this.exptype == 'edit') {
      this.expense.attachementpath.bills.forEach(
        (bill : bill) => {
          this.bills.push(this.createBill(bill));
        }
      );
    }


  }

  billArray() {
    return this.expenseForm.get('attachementpath.bills').value;
  }

  async addBill() {

    let resolvepath : string = null;
    let name : string = null;
    let mime : string = null;

    let file = await this.fileChooser.open();
    resolvepath = await this.filePath.resolveNativePath(file);
    let transferObj : FileTransferObject = this.fileTransfer.create();

    let UrlSegment = resolvepath.split('/');
    name = UrlSegment[UrlSegment.length - 1];

    let options : any = {
      fileKey: "file",
      fileName: name,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'bill': name}
    };

    let uploadResponse = await transferObj.upload(resolvepath,environment.baseURL+"/tripexpense/expense/uploadBill",options)
    if(uploadResponse.responseCode == 200) {
      let fileStatus =  await this.file.resolveLocalFilesystemUrl(resolvepath);
      (fileStatus as any).file(
        (data) => {
          mime = data.type;
          let uploadedBill :  bill = Object.assign({},{
            name: name,
            size: uploadResponse.bytesSent,
            type: mime,
            uploaded: true
          });

          this.bills.push(this.createBill(uploadedBill));
        }
      );
    }
  }

  createBill(upload : bill) {
    return this.fb.group({
      name: new FormControl(upload.name),
      size: new FormControl(upload.size),
      type: new FormControl(upload.type),
      uploaded: new FormControl(upload.uploaded)
    });
  }

  deleteBill(i : number) {
    this.bills.removeAt(i);
  }

  ionViewDidEnter() {
 
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
    if(this.expenseForm.valid) {

      
      if(this.exptype == 'add') {
        this.store.dispatch(new AddExpense(this.expenseForm.value));
      }
      else if(this.exptype == 'edit') {
        console.log(this.exptype); 
        let prevExp : expenselist = Object.assign({},this.expense);
        let currentExpense = Object.assign(prevExp,this.expenseForm.value);
        this.store.dispatch(new EditExpense(currentExpense));
      }
    }


  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "expense");
  }
}
