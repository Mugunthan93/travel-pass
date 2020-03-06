import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, PickerController, IonSelect } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CalendarModalComponent } from 'src/app/components/calendar-modal/calendar-modal.component';
import { PassengerModalComponent } from 'src/app/components/passenger-modal/passenger-modal.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch: FormGroup;
  @ViewChild('select',{static : true}) select : IonSelect;
  traveller = [
    [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ],
    [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ],
    [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]
  ];

  constructor(
    public modalCtrl: ModalController,
    public pickrCtrl : PickerController,
    public fb : FormBuilder,
    public booking : BookingService
  ) {
  }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({
      from: this.fb.control(null),
      to: this.fb.control(null),
      departure: this.fb.control(new Date()),
      traveller : this.fb.control(null),
      class : this.fb.control(null)
    });

    this.oneWaySearch.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    console.log(this.oneWaySearch);
  }

  async selectCity(field) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
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
    const modal = await this.modalCtrl.create({
      component: CalendarModalComponent
    });

    modal.onDidDismiss().then(
      (selectedDate) => {
        this.oneWaySearch.controls['departure'].patchValue(selectedDate.data);
      }
    );

    return await modal.present();
  }

  searchFlight() {
    this.booking.search('flight');
  }

  async selectPassenger(numColumns, numOptions) {
    const pickr = await this.pickrCtrl.create({
      columns: [
      {
        name: 'Adult',
        options: [
          { text: 'One', value: '1' },
          { text: 'two', value: '2' },
          { text: 'three', value: '3' },
          { text: 'four', value: '4' },
          { text: 'five', value: '5' },
          { text: 'six', value: '6' },
          { text: 'seven', value: '7' },
          { text: 'eight', value: '8' },
          { text: 'nine', value: '9' }
        ],
        selectedIndex:3
      },
      {
        name: 'child',
        options: [
          { text: 'One', value: '1' },
          { text: 'two', value: '2' },
          { text: 'three', value: '3' },
          { text: 'four', value: '4' },
          { text: 'five', value: '5' },
          { text: 'six', value: '6' },
          { text: 'seven', value: '7' },
          { text: 'eight', value: '8' },
          { text: 'nine', value: '9' }
        ],
        selectedIndex:3
        },
        {
          name: 'infant',
          options: [
            { text: 'One', value: '1' },
            { text: 'two', value: '2' },
            { text: 'three', value: '3' },
            { text: 'four', value: '4' },
            { text: 'five', value: '5' },
            { text: 'six', value: '6' },
            { text: 'seven', value: '7' },
            { text: 'eight', value: '8' },
            { text: 'nine', value: '9' }
          ],
          selectedIndex:3
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role : 'cancel'
        },
        {
          text: 'confirm',
          role: 'confirm',
          handler: (val) => {
            console.log(val);
          }
        }
      ],
      cssClass :'passenger'
    });

    return await pickr.present();
  }

  getColumns(numColumns, numOptions, columnOptions) {
  let columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push({
      name: `col-${i}`,
      options: this.getColumnOptions(i, numOptions, columnOptions)
    });
  }

  return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }
  }

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      showBackdrop : true,
      backdropDismiss : true,
      cssClass : 'passenger'
    });

    modal.onDidDismiss().then(
      (selecetedPassenger) => {
        this.oneWaySearch.controls['traveller'].patchValue(selecetedPassenger.data);
      }
    );

    return await modal.present();
  }

  selectClass() {
    console.log(this.oneWaySearch);
    this.select.open();
  }
}
