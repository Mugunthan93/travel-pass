import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { BookMode, BookType } from 'src/app/stores/book.state';
import { SetFirstPassengers } from 'src/app/stores/passenger/cab.passenger.state';
import { SetCabForm } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss'],
})
export class LocalPage implements OnInit {

  localCabSearch : FormGroup;
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

    this.localCabSearch = new FormGroup({
      source: this.fb.control(null,[Validators.required]),
      passenger : this.fb.control(null,[Validators.required]),
      departure: this.fb.control(null, [Validators.required]),
      return: this.fb.control(null, [Validators.required]),
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
        this.localCabSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(field : string) {
    let FromDate: Date = this.newDate;
    if (field == 'return') {
      if (this.localCabSearch.controls['departure'].value > this.localCabSearch.controls['return'].value) {
        this.localCabSearch.controls['return'].setValue(null);
      }
      FromDate = this.localCabSearch.controls['departure'].value;
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
      defaultDate: this.localCabSearch.controls[field].value,
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
      if (field == 'departure' && event.data.dateObj > this.localCabSearch.controls['return'].value) {
        this.localCabSearch.controls['return'].setValue(null);
      }
      this.localCabSearch.controls[field].patchValue(event.data.dateObj);
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
    this.localCabSearch.controls['cab_type'].patchValue(evt.detail.value);
  }

  changePassenger(evt : CustomEvent) {
    this.localCabSearch.controls['passenger'].patchValue(evt.detail.value);
  }

  searchCab() {
    this.formSubmit = true;
    console.log(this.localCabSearch);
    if(this.localCabSearch.valid) {
      this.store.dispatch([
        new SetCabForm(this.localCabSearch.value),
        new BookMode('cab'),
        new BookType('local'),
        new SetFirstPassengers(),
        new Navigate(['/','home','book','cab'])
      ]);
    }
  }


  swapTrip() {
    let from = this.localCabSearch.value.source;
    let to = this.localCabSearch.value.destination;
    this.localCabSearch.controls['source'].patchValue(to);
    this.localCabSearch.controls['destination'].patchValue(from);
  }

  errorClass(name : string) {
    return {
      'initial': (this.localCabSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.localCabSearch.controls[name].value !== null ||
        (this.localCabSearch.controls[name].valid && !this.formSubmit) ||
        (this.localCabSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.localCabSearch.controls[name].invalid && this.formSubmit)
    }
  }
}
