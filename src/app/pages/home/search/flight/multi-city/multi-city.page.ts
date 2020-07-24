import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, IonSelect } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';
import { Store } from '@ngxs/store';
import { AlertOptions } from '@ionic/core';
import { MultiCityForm, MultiCitySearch } from 'src/app/stores/search/flight/multi-city.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  @ViewChild('select',{static : true}) select : IonSelect;
  multiCitySearch: FormGroup;
  trips: FormArray;
  formSubmit: boolean = false;
  newDate: Date;
  customAlertOptions: AlertOptions;


  constructor(
    public router: Router,
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {
    this.multiCitySearch = this.fb.group({
      trips: this.fb.array([this.createTrip()]),
      traveller: this.fb.control(null, [Validators.required]),
      class: this.fb.control('all', [Validators.required])
    });
    
    this.trips = this.multiCitySearch.get('trips') as FormArray;
    this.newDate = new Date();

    console.log(this.multiCitySearch);

    this.customAlertOptions = {
      cssClass: 'cabinClass'
    }

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
    console.log(this.multiCitySearch);
  }

  removeTrip(tripArray, tripElement) {
    this.trips.removeAt(tripElement);
    console.log(tripArray,tripElement);
  }

  async selectCity(field: string, control: any[], i: number) {
    console.log(control,i);
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
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
      color: 'dark',
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

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers: this.multiCitySearch.controls['traveller'].value
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'passenger'
    });

    modal.onDidDismiss().then(
      (selectedPassenger) => {
        if (selectedPassenger.role == "backdrop") {
          return;
        }
        if (selectedPassenger.data.adult == 0 &&
          selectedPassenger.data.child == 0 &&
          selectedPassenger.data.infant == 0) {
          this.multiCitySearch.controls['traveller'].patchValue(null);
        }
        else {
          this.multiCitySearch.controls['traveller'].patchValue(selectedPassenger.data);
        }
      }
    );

    return await modal.present();
  }
  
  selectClass() {
    this.select.open();
  }

  changeClass(evt: CustomEvent) {
    console.log(evt);
    this.multiCitySearch.controls['class'].setValue(evt.detail.value);
  }

  searchFlight() {
    this.formSubmit = true;
    console.log(this.multiCitySearch);
    if (this.multiCitySearch.valid) {
      this.store.dispatch(new MultiCityForm(this.multiCitySearch.value));
      this.store.dispatch(new MultiCitySearch());
    }
  }

  errorClass(name: string) {
    return {
      'initial': (this.multiCitySearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.multiCitySearch.controls[name].value !== null ||
        (this.multiCitySearch.controls[name].valid && !this.formSubmit) ||
        (this.multiCitySearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.multiCitySearch.controls[name].invalid && this.formSubmit)
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
