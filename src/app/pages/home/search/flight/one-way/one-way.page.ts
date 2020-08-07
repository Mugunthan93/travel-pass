import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, PickerController, IonSelect, Platform, PopoverController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { PassengerModalComponent } from 'src/app/components/flight/passenger-modal/passenger-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Store } from '@ngxs/store';
import { OverlayEventDetail, AlertOptions } from '@ionic/core';
import { OneWaySearch, OneWayForm } from 'src/app/stores/search/flight/oneway.state';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';

export interface passengerInput{
  adult: number
  child: number
  infant: number
}

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch: FormGroup;
  @ViewChild('select', { static: true }) select: IonSelect;
  formSubmit: boolean = false;
  newDate: Date;
  customAlertOptions: AlertOptions;

  constructor(
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public pickrCtrl: PickerController,
    public fb: FormBuilder,
    public platform: Platform,
    public store : Store
  ) {
  }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({
      from: this.fb.control(null,[Validators.required]),
      to: this.fb.control(null, [Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
      traveller: this.fb.control(null, [Validators.required]),
      class: this.fb.control('all', [Validators.required])
    });

    this.newDate = new Date();

    this.customAlertOptions = {
      cssClass:'cabinClass'
    }

  }

  async selectCity(field) {
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
        this.oneWaySearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  swapTrip() {
    let from = this.oneWaySearch.value.from;
    let to = this.oneWaySearch.value.to;
    this.oneWaySearch.controls['from'].patchValue(to);
    this.oneWaySearch.controls['to'].patchValue(from);
  }

  async selectDate() {
    console.log(this.oneWaySearch.controls['departure'].value);
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
      defaultDate: this.oneWaySearch.controls['departure'].value,
      from: this.newDate,
      to: 0
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
      this.oneWaySearch.controls['departure'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return; 
    }

  }

  searchFlight() {
    this.formSubmit = true;
    console.log(this.oneWaySearch);
    if (this.oneWaySearch.valid) {
      this.store.dispatch(new OneWayForm(this.oneWaySearch.value));
      this.store.dispatch(new OneWaySearch());
    }
  }

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers : this.oneWaySearch.controls['traveller'].value
      },
      showBackdrop : true,
      backdropDismiss : true,
      cssClass: 'passenger'
    });

    modal.onDidDismiss().then(
      (selectedPassenger: OverlayEventDetail<passengerInput>) => {
        if (selectedPassenger.role == "backdrop") {
          return;
        }
        if (selectedPassenger.data.adult == 0 &&
          selectedPassenger.data.child == 0 &&
          selectedPassenger.data.infant == 0) {
          this.oneWaySearch.controls['traveller'].patchValue(null);
        }
        else {  
          this.oneWaySearch.controls['traveller'].patchValue(selectedPassenger.data);
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
    this.oneWaySearch.controls['class'].setValue(evt.detail.value);
  }

  errorClass(name : string) {
    return {
      'initial': (this.oneWaySearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.oneWaySearch.controls[name].value !== null ||
        (this.oneWaySearch.controls[name].valid && !this.formSubmit) ||
        (this.oneWaySearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.oneWaySearch.controls[name].invalid && this.formSubmit)
    }
  }
}
