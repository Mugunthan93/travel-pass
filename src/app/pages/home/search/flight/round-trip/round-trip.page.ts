import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect, ModalController, PickerController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { PassengerModalComponent } from 'src/app/components/passenger-modal/passenger-modal.component';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  roundTripSearch : FormGroup
  @ViewChild('select', { static: true }) select: IonSelect;


  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public pickrCtrl: PickerController,
    public fb: FormBuilder,
    public booking: BookingService
  ) { }

  ngOnInit() {
    this.roundTripSearch = new FormGroup({
      from: this.fb.control(null),
      to: this.fb.control(null),
      departure: this.fb.control(new Date()),
      return:this.fb.control(new Date()),
      traveller: this.fb.control(null),
      class: this.fb.control(null)
    });

    this.roundTripSearch.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    this.roundTripSearch.controls['departure'].valueChanges.subscribe(
      (value) => {
        this.roundTripSearch.controls['return'].patchValue(value);
        console.log(value);
      }
    );

    console.log(this.roundTripSearch);
  }

  searchFlight() {
    this.router.navigate(['/','home','result','flight','round-trip']);
  }

  async selectCity(field) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        this.roundTripSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  swapTrip() {
    let from = this.roundTripSearch.value.from;
    let to = this.roundTripSearch.value.to;
    this.roundTripSearch.controls['from'].patchValue(to);
    this.roundTripSearch.controls['to'].patchValue(from);
  }

  async selectDate(field : string) {
    const options: CalendarModalOptions = {
      title: field.toLocaleUpperCase(),
      pickMode: 'single',
      color: 'dark',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      from: this.roundTripSearch.controls[field].value,
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
      this.roundTripSearch.controls[field].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers: this.roundTripSearch.controls['traveller'].value
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'passenger'
    });

    modal.onDidDismiss().then(
      (selecetedPassenger) => {
        this.roundTripSearch.controls['traveller'].patchValue(selecetedPassenger.data);
      }
    );

    return await modal.present();
  }

  selectClass() {
    this.select.open();
  }

}
