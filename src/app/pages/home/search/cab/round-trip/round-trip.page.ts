import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { SetCabForm } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  roundTripCabSearch : FormGroup;
  @ViewChild('selectcab', { static: true }) selectcab: IonSelect;
  @ViewChild('selectpass', { static: true }) selectpass: IonSelect;
  formSubmit: boolean = false;
  newDate: Date;
  customAlertOptions;
  passengerArray : number[];

  constructor(
    public modalCtrl : ModalController,
    public fb : FormBuilder,
    private store : Store
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

    this.roundTripCabSearch = new FormGroup({
      source: this.fb.control(null,[Validators.required]),
      destination: this.fb.control(null, [Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
      return: this.fb.control(null, [Validators.required]),
      cab_type: this.fb.control(null, [Validators.required]),
      passenger : this.fb.control(null,[Validators.required])
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
        this.roundTripCabSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(field : string) {

    let FromDate: Date = this.newDate;
    if (field == 'return') {
      if (this.roundTripCabSearch.controls['departure'].value > this.roundTripCabSearch.controls['return'].value) {
        this.roundTripCabSearch.controls['return'].setValue(null);
      }
      FromDate = this.roundTripCabSearch.controls['departure'].value;
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
      defaultDate: this.roundTripCabSearch.controls[field].value,
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
      if (field == 'departure' && event.data.dateObj > this.roundTripCabSearch.controls['return'].value) {
        this.roundTripCabSearch.controls['return'].setValue(null);
      }
      this.roundTripCabSearch.controls[field].patchValue(event.data.dateObj);
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
    this.roundTripCabSearch.controls['cab_type'].patchValue(evt.detail.value);
  }

  changePassenger(evt : CustomEvent) {
    this.roundTripCabSearch.controls['passenger'].patchValue(evt.detail.value);
  }

  searchCab() {
    this.formSubmit = true;
    console.log(this.roundTripCabSearch);
    if(this.roundTripCabSearch.valid) {
      this.store.dispatch([
        new SetCabForm(this.roundTripCabSearch.value),
        new Navigate(['/','home','book','cab'])
      ]);

    }
  }


  swapTrip() {
    let from = this.roundTripCabSearch.value.source;
    let to = this.roundTripCabSearch.value.destination;
    this.roundTripCabSearch.controls['source'].patchValue(to);
    this.roundTripCabSearch.controls['destination'].patchValue(from);
  }

  errorClass(name : string) {
    return {
      'initial': (this.roundTripCabSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.roundTripCabSearch.controls[name].value !== null ||
        (this.roundTripCabSearch.controls[name].valid && !this.formSubmit) ||
        (this.roundTripCabSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.roundTripCabSearch.controls[name].invalid && this.formSubmit)
    }
  }
}
