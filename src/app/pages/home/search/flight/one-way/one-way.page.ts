import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { CalendarModalComponent } from 'src/app/components/calendar-modal/calendar-modal.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch: FormGroup

  constructor(
    public modalCtrl: ModalController,
    public fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({
      from: this.fb.control(null),
      to: this.fb.control(null),
      departure: this.fb.control(null)
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

  async selectDate() {
    const modal = await this.modalCtrl.create({
      component: CalendarModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {

      }
    );

    return await modal.present();
  }

}
