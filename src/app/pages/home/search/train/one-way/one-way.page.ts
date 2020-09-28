import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Observable } from 'rxjs';
import { TrainSearchState } from 'src/app/stores/search/train.state';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { TrainOneWayForm } from 'src/app/stores/search/train/oneway.state';
import { trainstation, city } from 'src/app/stores/shared.state';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { AddTrainPassenger, trainpassenger } from 'src/app/stores/passenger/train.passenger.state';
import { user } from 'src/app/models/user';
import { UserState } from 'src/app/stores/user.state';
import * as moment from 'moment';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  @ViewChild('select', { static: true }) select: IonSelect;
  oneWayForm: FormGroup;
  classes: string[] = ['All Class', 'Sleeper Class', 'Third AC', 'Second AC', 'First AC', 'Second Seating', 'AC Chair Car', 'First Class', 'Third AC Economy'];
  customAlertOptions: AlertOptions;
  newDate: Date;
  formSubmit: boolean = false;
  
  currentType: String;
  trainType$: Observable<String>;
  user: user;
  
  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.oneWayForm = new FormGroup({
      from_name: new FormControl(null, [Validators.required]),
      from_code: new FormControl(null),
      from_location: new FormControl(null, [Validators.required]),
      to_name: new FormControl(null, [Validators.required]),
      to_code: new FormControl(null),
      to_location: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      class: new FormControl(null, [Validators.required])
    });

    this.trainType$ = this.store.select(TrainSearchState.getTrainType)
      .pipe(
        map(
          (str : String) => {
            this.oneWayForm.reset();
            this.formSubmit = false;
            this.currentType = str;
            return str;
          }
        )
      );

    this.customAlertOptions = {
      header : 'Select Class',
      cssClass: 'cabinClass'
    }

    this.newDate = new Date();
  }

  selectClass() {
    this.select.open();
  }

  changeClass(evt: CustomEvent) {
    console.log(evt);
    this.oneWayForm.controls['class'].setValue(evt.detail.value);
  }

  async getStation(field: string) {
    if (this.currentType == 'domestic') {
      const modal = await this.modalCtrl.create({
        component: SelectModalComponent,
        componentProps: {
          title: 'Station',
          category: 'domestic'
        },
      });

      modal.onDidDismiss().then(
        (selectedStation) => {
          if (selectedStation.role == "backdrop") {
            return;
          }
          console.log(selectedStation);
          let station: trainstation = selectedStation.data;
          this.oneWayForm.controls[field + '_name'].patchValue(station.station_name);
          this.oneWayForm.controls[field + '_code'].patchValue(station.station_code);
          this.oneWayForm.controls[field + '_location'].patchValue(station.location);
          console.log(this.oneWayForm);
        }
      );

      return await modal.present();
    }
    else if (this.currentType == 'international') {
      const modal = await this.modalCtrl.create({
        component: SelectModalComponent,
        componentProps: {
          title: 'Station',
          category: 'international'
        },
      });

      modal.onDidDismiss().then(
        (selectedStation) => {
          if (selectedStation.role == "backdrop") {
            return;
          }
          console.log(selectedStation);
          let station: city = selectedStation.data;
          this.oneWayForm.controls[field + '_code'].patchValue(station.city_code);
          this.oneWayForm.controls[field + '_location'].patchValue(station.city_name);
          console.log(this.oneWayForm);
        }
      );

      return await modal.present();
    }
  }

  async selectDate() {
    console.log(this.oneWayForm.controls['date'].value);
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
      defaultDate: this.oneWayForm.controls['date'].value,
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
      this.oneWayForm.controls['date'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  errorClass(name: string) {
    return {
      'initial': (this.oneWayForm.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.oneWayForm.controls[name].value !== null ||
        (this.oneWayForm.controls[name].valid && !this.formSubmit) ||
        (this.oneWayForm.controls[name].valid && this.formSubmit),
      'invalid':
        (this.oneWayForm.controls[name].invalid && this.formSubmit)
    }
  }

  searchTrain() {
    this.formSubmit = true;
    console.log(this.oneWayForm);
    if (this.oneWayForm.valid) {
      this.store.dispatch(new TrainOneWayForm(this.oneWayForm.value));
    }
  }

}
