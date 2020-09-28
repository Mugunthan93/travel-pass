import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { TrainSearchState } from 'src/app/stores/search/train.state';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { trainstation, city } from 'src/app/stores/shared.state';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { map, delay } from 'rxjs/operators';
import { TrainMultiCityForm } from 'src/app/stores/search/train/multi-city.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  @ViewChildren('select') select: QueryList<IonSelect>;
  multiCityForm: FormGroup;
  classes: string[] = ['All Class', 'Sleeper Class', 'Third AC', 'Second AC', 'First AC', 'Second Seating', 'AC Chair Car', 'First Class', 'Third AC Economy'];
  customAlertOptions: AlertOptions;
  newDate: Date;
  formSubmit: boolean = false;
  trainType$: Observable<String>;

  currentType: String;
  trips: FormArray;

  constructor(
    private store: Store,
    public fb : FormBuilder,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.multiCityForm = this.fb.group({
      trips: this.fb.array([this.createTrip()])
    });

    this.trainType$ = this.store.select(TrainSearchState.getTrainType)
      .pipe(
        map(
          (str: String) => {
            this.formSubmit = false;
            if (this.currentType !== str) {
              this.multiCityForm.reset();
              this.currentType = str;
            }
            return str;
          }
        )
      );

    this.customAlertOptions = {
      header: 'Select Class',
      cssClass: 'cabinClass'
    }

    this.newDate = new Date();
    this.trips = this.multiCityForm.get('trips') as FormArray;

    this.multiCityForm.valueChanges.subscribe(el => console.log(el));

  }

  createTrip() {
    return this.fb.group({
      from_name: this.fb.control(null, [Validators.required]),
      from_code: this.fb.control(null),
      from_location: this.fb.control(null, [Validators.required]),
      to_name: this.fb.control(null, [Validators.required]),
      to_code: this.fb.control(null),
      to_location: this.fb.control(null, [Validators.required]),
      date: this.fb.control(null, [Validators.required]),
      class: this.fb.control(null, [Validators.required])
    });
  }

  addTrip() {
    this.trips.push(this.createTrip());
  }

  removeTrip(tripElement : number) {
    this.trips.removeAt(tripElement);
  }

  selectClass(i : number) {
    this.select.toArray()[i].open();
  }

  changeClass(evt: CustomEvent,form : FormGroup) {
    console.log(evt);
    form.controls['class'].setValue(evt.detail.value);
  }

  async getStation(form: any[], i: number,field: string) {
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
          form[i].controls[field + '_name'].patchValue(station.station_name);
          form[i].controls[field + '_code'].patchValue(station.station_code);
          form[i].controls[field + '_location'].patchValue(station.location);
          console.log(form);
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
          form[i].controls[field + '_code'].patchValue(station.city_code);
          form[i].controls[field + '_location'].patchValue(station.city_name);
          console.log(form);
        }
      );

      return await modal.present();
    }
  }

  async selectDate(form: FormGroup) {
    console.log(form.controls['date'].value);
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
      defaultDate: form.controls['date'].value,
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
      form.controls['date'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  errorClass(form : FormGroup,name: string) {
    return {
      'initial': (form.controls[name].value == null) && !this.formSubmit,
      'valid':
        form.controls[name].value !== null ||
        (form.controls[name].valid && !this.formSubmit) ||
        (form.controls[name].valid && this.formSubmit),
      'invalid':
        (form.controls[name].invalid && this.formSubmit)
    }
  }

  searchTrain() {
    this.formSubmit = true;
    console.log(this.multiCityForm);
    if (this.multiCityForm.valid) {
      this.store.dispatch(new TrainMultiCityForm(this.multiCityForm.value.trips));
    }
  }
}
