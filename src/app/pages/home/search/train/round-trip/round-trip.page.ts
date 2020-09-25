import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { TrainSearchState } from 'src/app/stores/search/train.state';
import { map } from 'rxjs/operators';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { trainstation, city } from 'src/app/stores/shared.state';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { TrainRoundTripForm } from 'src/app/stores/search/train/round-trip.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  @ViewChild('departureselect', { static: true }) departureselect: IonSelect;
  @ViewChild('returnselect', { static: true }) returnselect: IonSelect;
  roundTripForm: FormGroup;
  classes: string[] = ['All Class', 'Sleeper Class', 'Third AC', 'Second AC', 'First AC', 'Second Seating', 'AC Chair Car', 'First Class', 'Third AC Economy'];
  customAlertOptions: AlertOptions;
  newDate: Date;
  formSubmit: boolean = false;
  trainType$: Observable<String>;

  currentType: String;

  constructor(
    private store: Store,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.roundTripForm = new FormGroup({
      from_name: new FormControl(null, [Validators.required]),
      from_code: new FormControl(null),
      from_location: new FormControl(null, [Validators.required]),
      to_name: new FormControl(null, [Validators.required]),
      to_code: new FormControl(null),
      to_location: new FormControl(null, [Validators.required]),
      departure_date: new FormControl(null, [Validators.required]),
      departure_class: new FormControl(null, [Validators.required]),
      return_date: new FormControl(null, [Validators.required]),
      return_class: new FormControl(null, [Validators.required])
    });

    this.trainType$ = this.store.select(TrainSearchState.getTrainType)
      .pipe(
        map(
          (str: String) => {
            this.roundTripForm.reset();
            this.formSubmit = false;
            this.currentType = str;
            return str;
          }
        )
      );

    this.customAlertOptions = {
      header: 'Select Class',
      cssClass: 'cabinClass'
    }

    this.newDate = new Date();

  }

  selectClass(type: string) {
    if (type == 'departure') {
      this.departureselect.open();
    }
    else if (type == 'return') {
      this.returnselect.open();
    }
  }

  changeClass(evt: CustomEvent) {
    console.log(evt);
    this.roundTripForm.controls['class'].setValue(evt.detail.value);
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
          this.roundTripForm.controls[field + '_name'].patchValue(station.station_name);
          this.roundTripForm.controls[field + '_code'].patchValue(station.station_code);
          this.roundTripForm.controls[field + '_location'].patchValue(station.location);
          console.log(this.roundTripForm);
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
          this.roundTripForm.controls[field + '_code'].patchValue(station.city_code);
          this.roundTripForm.controls[field + '_location'].patchValue(station.city_name);
          console.log(this.roundTripForm);
        }
      );

      return await modal.present();
    }
  }

  async selectDate(type : string) {
    console.log(this.roundTripForm.controls[type + '_date'].value);

    let FromDate: Date = this.newDate;
    if (type == 'return') {
      if (this.roundTripForm.controls['departure_date'].value > this.roundTripForm.controls['return_date'].value) {
        this.roundTripForm.controls['return_date'].setValue(null);
      }
      FromDate = this.roundTripForm.controls['departure_date'].value;
    }

    const options: CalendarModalOptions = {
      title: type.toUpperCase(),
      pickMode: 'single',
      color: '#e87474',
      cssClass: 'ion2-calendar',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.roundTripForm.controls[type + '_date'].value,
      from: FromDate,
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
      if (type == 'departure' && (event.data.dateObj > this.roundTripForm.controls['return_date'].value)) {
        this.roundTripForm.controls['return_date'].setValue(null);
      }
      this.roundTripForm.controls[type + '_date'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  errorClass(name: string) {
    return {
      'initial': (this.roundTripForm.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.roundTripForm.controls[name].value !== null ||
        (this.roundTripForm.controls[name].valid && !this.formSubmit) ||
        (this.roundTripForm.controls[name].valid && this.formSubmit),
      'invalid':
        (this.roundTripForm.controls[name].invalid && this.formSubmit)
    }
  }

  searchTrain() {
    this.formSubmit = true;
    console.log(this.roundTripForm);
    if (this.roundTripForm.valid) {
      this.store.dispatch(new TrainRoundTripForm(this.roundTripForm.value));
    }
  }
}
