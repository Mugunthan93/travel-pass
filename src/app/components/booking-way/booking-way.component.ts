<<<<<<< HEAD
import { Component, OnInit, Input } from '@angular/core';
import { booking, BookingService } from 'src/app/services/booking/booking.service';
=======
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { user } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { PickerController, ModalController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { OneWayTrip, Picker, City } from 'src/app/models/search';
import { FormGroup, FormControl } from '@angular/forms';
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2

@Component({
  selector: 'app-booking-way',
  templateUrl: './booking-way.component.html',
  styleUrls: ['./booking-way.component.scss'],
})
export class BookingWayComponent implements OnInit {

<<<<<<< HEAD
  booking : booking;

  constructor(
    public bookingService : BookingService
  ) { 
    this.booking = this.bookingService.getBooking;
    console.log(this.booking);
  }

  ngOnInit() {
  }

  tripWayChange(event) {
    console.log(event);
=======

  //local variable
  user: user;
  trip: OneWayTrip;
  searchTripForm: FormGroup;
  date = "2019-10-01T15:43:40.394Z";
  class = ['Economy', 'Premium Economy', 'Premium', 'First Class'];
  person = ['1', '2', '3', '4', '5', '6'];


  //Subscription data
  userSub: Subscription;
  citySub: Subscription;

  constructor(
    public authService: AuthService,
    public pickerCtrl: PickerController,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {

    this.searchTripForm = new FormGroup({
      origin: new FormGroup({
        city_code: new FormControl(),
        city_name: new FormControl()
      }),
      destination: new FormGroup({
        city_code: new FormControl(),
        city_name: new FormControl()
      }),
      departure_date: new FormControl(),
      arrival_date: new FormControl(),
      persons: new FormControl(),
      class: new FormControl()
    });
  }

  selectTrip(evt) {
    console.log(evt);
  }

  onSearchTrip() {
    console.log(this.searchTripForm);
  }

  getPicker(data) {
    let pick = this.pickerCtrl.create({
      columns: this.getColumns(1, 5, data),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(value.Person.text, value.Person.value);
          }
        }
      ]
    }).then(
      (pickEl) => {
        pickEl.present();
        pickEl.dismiss(
          (selectedVal) => {
            console.log(selectedVal);
          }
        );
      }
    );
    return pick;
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

    return options;
  }

  getModal(location, point) {
    let modal = this.modalCtrl.create({
      component: CityModalComponent,
      componentProps: {
        location: location,
        point: point
      }
    }).then(
      (modalEl) => {
        modalEl.present();
        modalEl.dismiss(
          (selectedCity: City, point: string) => {
            if (point == 'from') {
              this.trip.origin = selectedCity;
            }
            else if (point == 'to') {
              this.trip.destination = selectedCity;
            }
          }
        );
      }
    )

    return modal;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.citySub.unsubscribe();
>>>>>>> 8fb4fd12f19ddbd0034f79848d9a1437baa4a6b2
  }

}
