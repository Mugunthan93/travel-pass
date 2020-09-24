import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Observable, BehaviorSubject } from 'rxjs';
import { TrainSearchState } from 'src/app/stores/search/train.state';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { TrainOneWayForm } from 'src/app/stores/search/train/oneway.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWayForm: FormGroup;
  @ViewChild('select', { static: true }) select: IonSelect;
  classes: string[] = ['All Class', 'Sleeper Class', 'Third AC', 'Second AC', 'First AC', 'Second Seating', 'AC Chair Car', 'First Class', 'Third AC Economy'];
  customAlertOptions: AlertOptions;
  newDate: Date;
  formSubmit: boolean = false;
  trainType$: Observable<String>;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.oneWayForm = new FormGroup({
      from: new FormControl(null,[Validators.required]),
      to: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      class: new FormControl(null, [Validators.required])
    });

    this.trainType$ = this.store.select(TrainSearchState.getTrainType)
      .pipe(
        map(
          (str: string) => {
            console.log(str);
            this.oneWayForm.reset();
            this.formSubmit = false;
            return str;
          }
        )
      );

    this.customAlertOptions = {
      header : 'Select Class',
      cssClass: 'cabinClass'
    }

    this.newDate = new Date();

    this.oneWayForm.valueChanges.subscribe(el => console.log(el));

  }

  selectClass() {
    this.select.open();
  }

  changeClass(evt: CustomEvent) {
    console.log(evt);
    this.oneWayForm.controls['class'].setValue(evt.detail.value);
  }

  async getStation(field : string) {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        title: 'Station'
      },
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        if (selectedCity.role == "backdrop") {
          return;
        }
        console.log(selectedCity);
        this.oneWayForm.controls[field].patchValue(selectedCity.data);
        console.log(this.oneWayForm);
      }
    );

    return await modal.present();
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
