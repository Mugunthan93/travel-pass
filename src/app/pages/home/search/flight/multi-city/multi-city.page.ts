import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, IonSelect } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { PassengerModalComponent } from 'src/app/components/passenger-modal/passenger-modal.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  @ViewChild('select',{static : true}) select : IonSelect;
  multiCitySearch: FormGroup;
  trips: FormArray;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.multiCitySearch = this.fb.group({
      trips: this.fb.array([this.createTrip()]),
      traveller: this.fb.control(null),
      class:this.fb.control(null)
    });
    console.log(this.multiCitySearch);
  }

  createTrip(): FormGroup {
    return this.fb.group({
      from: this.fb.control(null),
      to: this.fb.control(null),
      departure: this.fb.control(new Date())
    });
  }

  addTrip() {
    this.trips = this.multiCitySearch.get('trips') as FormArray;
    this.trips.push(this.createTrip());
  }

  async selectCity(field: string, control: FormGroup) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        control.controls[field].patchValue(selectedCity.data);
        // this.multiCitySearch.controls['trips'].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(trip : FormGroup) {
    const options: CalendarModalOptions = {
      title: 'DEPARTURE',
      pickMode: 'single',
      color: 'dark',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: trip.value.departure
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
      trip.controls['departure'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }
  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers: this.multiCitySearch.controls['traveller'].value
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'passenger'
    });

    modal.onDidDismiss().then(
      (selecetedPassenger) => {
        this.multiCitySearch.controls['traveller'].patchValue(selecetedPassenger.data);
      }
    );

    return await modal.present();
  }
  selectClass() {
    this.select.open();
  }

  searchFlight() {
    this.router.navigate(['/','home','result','flight','multi-city']);
  }

}
