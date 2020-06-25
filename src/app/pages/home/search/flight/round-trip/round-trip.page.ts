import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect, ModalController, PickerController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';
import { Store } from '@ngxs/store';
import { AlertOptions } from '@ionic/core';
import { RoundTripSearch, RoundTripForm } from 'src/app/stores/search/flight/round-trip.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  roundTripSearch : FormGroup
  @ViewChild('select', { static: true }) select: IonSelect;
  formSubmit: boolean = false;
  newDate: Date;
  customAlertOptions: AlertOptions;


  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public pickrCtrl: PickerController,
    public fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit() {
    this.roundTripSearch = new FormGroup({
      from: this.fb.control(null,[Validators.required]),
      to: this.fb.control(null, [Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
      return: this.fb.control(null, [Validators.required]),
      traveller: this.fb.control(null, [Validators.required]),
      class: this.fb.control(null, [Validators.required])
    });

    this.roundTripSearch.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    this.newDate = new Date();
    console.log(this.roundTripSearch);

    this.customAlertOptions = {
      cssClass: 'cabinClass'
    }
  }

  searchFlight() {
    this.formSubmit = true;
    console.log(this.roundTripSearch);
    if (this.roundTripSearch.valid) {
      this.store.dispatch(new RoundTripForm(this.roundTripSearch.value));
      this.store.dispatch(new RoundTripSearch());
    }
  }

  async selectCity(field) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        if (selectedCity.role == "backdrop") {
          return;
        }
        this.roundTripSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  swapTrip() {
    let from = this.roundTripSearch.value.from;
    let to = this.roundTripSearch.value.to;
    this.roundTripSearch.controls['from'].patchValue(to);
    this.roundTripSearch.controls['to'].patchValue(from);
  }

  async selectDate(field: string) {
    let FromDate: Date = this.newDate;
    if (field == 'return') {
      if (this.roundTripSearch.controls['departure'].value > this.roundTripSearch.controls['return'].value) {
        this.roundTripSearch.controls['return'].setValue(null);
      }
      FromDate = this.roundTripSearch.controls['departure'].value;
    }

    const options: CalendarModalOptions = {
      title: field.toLocaleUpperCase(),
      pickMode: 'single',
      color: 'dark',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.roundTripSearch.controls[field].value,
      from: FromDate,
      to:0
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
      if (field == 'departure' && event.data.dateObj > this.roundTripSearch.controls['return'].value) {
        this.roundTripSearch.controls['return'].setValue(null);
      }
      this.roundTripSearch.controls[field].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }
    
  }

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers: this.roundTripSearch.controls['traveller'].value
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
          this.roundTripSearch.controls['traveller'].patchValue(null);
        }
        else {
          this.roundTripSearch.controls['traveller'].patchValue(selectedPassenger.data);
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
    this.roundTripSearch.controls['class'].setValue(evt.detail.value);
  }

  errorClass(name : string) {
    return {
      'initial': (this.roundTripSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.roundTripSearch.controls[name].value !== null ||
        (this.roundTripSearch.controls[name].valid && !this.formSubmit) ||
        (this.roundTripSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.roundTripSearch.controls[name].invalid && this.formSubmit)
    }
  }

}
