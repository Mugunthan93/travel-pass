import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { BookMode, BookType } from 'src/app/stores/book.state';
import { SetFirstPassengers } from 'src/app/stores/passenger/cab.passenger.state';
import { SetCabForm } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWayCabSearch : FormGroup;
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

    this.oneWayCabSearch = new FormGroup({
      source: this.fb.control(null,[Validators.required]),
      destination: this.fb.control(null, [Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
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
        this.oneWayCabSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate() {
    console.log(this.oneWayCabSearch.controls['departure'].value);
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
      defaultDate: this.oneWayCabSearch.controls['departure'].value,
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
      this.oneWayCabSearch.controls['departure'].patchValue(event.data.dateObj);
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
    this.oneWayCabSearch.controls['cab_type'].patchValue(evt.detail.value);
  }

  changePassenger(evt : CustomEvent) {
    this.oneWayCabSearch.controls['passenger'].patchValue(evt.detail.value);
  }

  searchCab() {
    this.formSubmit = true;
    console.log(this.oneWayCabSearch);
    if(this.oneWayCabSearch.valid) {
      this.store.dispatch([
        new SetCabForm(this.oneWayCabSearch.value),
        new BookMode('cab'),
        new BookType('one-way'),
        new SetFirstPassengers(),
        new Navigate(['/','home','book','cab'])
      ]);
    }
  }


  swapTrip() {
    let from = this.oneWayCabSearch.value.source;
    let to = this.oneWayCabSearch.value.destination;
    this.oneWayCabSearch.controls['source'].patchValue(to);
    this.oneWayCabSearch.controls['destination'].patchValue(from);
  }

  errorClass(name : string) {
    return {
      'initial': (this.oneWayCabSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.oneWayCabSearch.controls[name].value !== null ||
        (this.oneWayCabSearch.controls[name].valid && !this.formSubmit) ||
        (this.oneWayCabSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.oneWayCabSearch.controls[name].invalid && this.formSubmit)
    }
  }

}
