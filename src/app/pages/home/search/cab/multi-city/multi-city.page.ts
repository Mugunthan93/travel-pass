import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  multiCityCabSearch : FormGroup;
  @ViewChild('selectcab', { static: true }) selectcab: IonSelect;
  @ViewChild('selectpass', { static: true }) selectpass: IonSelect;
  formSubmit: any;
  newDate: Date;
  customAlertOptions: (header: string) => any;
  passengerArray: number[];
  trips: any;

  constructor(
    public modalCtrl : ModalController,
    public fb : FormBuilder
  ) { }

  ngOnInit() {
    this.formSubmit = false;
    this.newDate = new Date();

    this.customAlertOptions = (header : string) : AlertOptions => {
      return {
        header : header,
        cssClass:'cabinClass'
      }
    }

    this.passengerArray = Array.from({length: 60}, (_, i) => i + 1);

    this.multiCityCabSearch = this.fb.group({
      trips: this.fb.array([this.createTrip()]),
      passenger: this.fb.control(null, [Validators.required]),
      cab_type: this.fb.control(null, [Validators.required])
    });
    this.trips = this.multiCityCabSearch.get('trips') as FormArray;
  }

  createTrip(): FormGroup {
    return this.fb.group({
      from: this.fb.control(null, [Validators.required]),
      to: this.fb.control(null, [Validators.required]),
      departure: this.fb.control(null, [Validators.required])
    });
  }

  addTrip() {
    this.trips.push(this.createTrip());
    console.log(this.multiCityCabSearch);
  }

  removeTrip(tripArray, tripElement) {
    this.trips.removeAt(tripElement);
    console.log(tripArray,tripElement);
  }

  async selectCity(field: string, control: any[], i: number) {
    console.log(control,i);
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        title: 'city'
      }
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        if (selectedCity.role == "backdrop") {
          return;
        }
        console.log(control);
        if (field == 'to') {
          if (control[i + 1]) {
            control[i+1].controls['from'].patchValue(selectedCity.data);
          }
          else{
            this.addTrip();
            control[i + 1].controls['from'].patchValue(selectedCity.data);
          }
          // if (i !== control.length - 1) {
          // }
        }
        control[i].controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(trips: any,i:number) {
    console.log(trips,i);
    let FromDate: Date = this.newDate;
    if (i < 0) {
      if (trips[i].controls['departure'].value > trips[i + 1].controls['departure'].value) {
        trips[i + 1].controls['departure'].setValue(null);
      }
    }
    if (i >= 1) {
      let k: number = i - 1;
      let fromdateIndex: number = k;
      for (k; k > -1; k --){
        if (trips[k].controls['departure'].value !== null) {
          fromdateIndex = k;
          break;
        }
      }
      console.log(fromdateIndex);
      FromDate = trips[fromdateIndex].controls['departure'].value;
    }

    const options: CalendarModalOptions = {
      title: 'DEPARTURE',
      pickMode: 'single',
      color: '#e87474',
      cssClass: 'ion2-calendar',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: trips[i].controls['departure'].value,
      from: FromDate
    }
    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: {
        options
      }
    });

    modal.present();

    const event: any = await modal.onDidDismiss();
    if (event.role == 'done') {
      if (i > 0 && (i !== (trips.length - 1)) && event.data.dateObj > trips[i+1].controls['departure'].value) {
        trips[i + 1].controls['departure'].setValue(null);
      }
      trips[i].controls['departure'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  selectCabType() {
    this.selectcab.open();
  }

  selectPassenger() {
    this.selectpass.open();
  }

  changeCabType(evt : CustomEvent) {
    this.multiCityCabSearch.controls['cab_type'].patchValue(evt.detail.value);
  }

  changePassenger(evt : CustomEvent) {
    this.multiCityCabSearch.controls['passenger'].patchValue(evt.detail.value);
  }

  searchCab() {
    this.formSubmit = true;
    console.log(this.multiCityCabSearch);
  }

  errorClass(name: string) {
    return {
      'initial': (this.multiCityCabSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.multiCityCabSearch.controls[name].value !== null ||
        (this.multiCityCabSearch.controls[name].valid && !this.formSubmit) ||
        (this.multiCityCabSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.multiCityCabSearch.controls[name].invalid && this.formSubmit)
    }
  }

  errorArrayClass(name: string,formGrp: FormGroup) {
    return {
      'initial': (formGrp.controls[name].value == null) && !this.formSubmit,
      'valid':
        formGrp.controls[name].value !== null ||
        (formGrp.controls[name].valid && !this.formSubmit) ||
        (formGrp.controls[name].valid && this.formSubmit),
      'invalid':
        (formGrp.controls[name].invalid && this.formSubmit)
    }
  }

}
