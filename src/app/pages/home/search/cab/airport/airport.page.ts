import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.page.html',
  styleUrls: ['./airport.page.scss'],
})
export class AirportPage implements OnInit {

  airportCabSearch : FormGroup;
  @ViewChild('selectcab', { static: true }) selectcab: IonSelect;
  @ViewChild('selectpass', { static: true }) selectpass: IonSelect;
  @ViewChild('selecttrip', { static: true }) selecttrip: IonSelect;
  formSubmit: boolean = false;
  newDate: Date;
  customAlertOptions;
  passengerArray : number[];

  constructor(
    public modalCtrl : ModalController,
    public fb : FormBuilder
  ) { }

  ngOnInit() {

    this.newDate = new Date();

    this.customAlertOptions = (header : string) : AlertOptions => {
      return {
        header : header,
        cssClass:'cabinClass'
      }
    }

    this.passengerArray = Array.from({length: 60}, (_, i) => i + 1);

    this.airportCabSearch = new FormGroup({
      source: this.fb.control(null,[Validators.required]),
      passenger : this.fb.control(null,[Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
      trip_type: this.fb.control(null, [Validators.required]),
      cab_type: this.fb.control(null, [Validators.required])
    });

  }

  async selectCity(field : string) {
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
        this.airportCabSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(field : string) {
    let FromDate: Date = this.newDate;
    if (field == 'return') {
      if (this.airportCabSearch.controls['departure'].value > this.airportCabSearch.controls['return'].value) {
        this.airportCabSearch.controls['return'].setValue(null);
      }
      FromDate = this.airportCabSearch.controls['departure'].value;
    }

    const options: CalendarModalOptions = {
      title: field.toLocaleUpperCase(),
      pickMode: 'single',
      color: '#e87474',
      cssClass: 'ion2-calendar',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.airportCabSearch.controls[field].value,
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
      if (field == 'departure' && event.data.dateObj > this.airportCabSearch.controls['return'].value) {
        this.airportCabSearch.controls['return'].setValue(null);
      }
      this.airportCabSearch.controls[field].patchValue(event.data.dateObj);
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

  selectTrip() {
    this.selecttrip.open();
  }

  changeCabType(evt : CustomEvent) {
    this.airportCabSearch.controls['cab_type'].patchValue(evt.detail.value);
  }

  changeTripType(evt : CustomEvent) {
    this.airportCabSearch.controls['trip_type'].patchValue(evt.detail.value);
  }

  changePassenger(evt : CustomEvent) {
    this.airportCabSearch.controls['passenger'].patchValue(evt.detail.value);
  }

  searchCab() {
    this.formSubmit = true;
    console.log(this.airportCabSearch);
  }


  swapTrip() {
    let from = this.airportCabSearch.value.source;
    let to = this.airportCabSearch.value.destination;
    this.airportCabSearch.controls['source'].patchValue(to);
    this.airportCabSearch.controls['destination'].patchValue(from);
  }

  errorClass(name : string) {
    return {
      'initial': (this.airportCabSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.airportCabSearch.controls[name].value !== null ||
        (this.airportCabSearch.controls[name].valid && !this.formSubmit) ||
        (this.airportCabSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.airportCabSearch.controls[name].invalid && this.formSubmit)
    }
  }

}
