import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';
import { CalendarModalOptions, CalendarModal, CalendarResult } from 'ion2-calendar';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddPassenger } from 'src/app/stores/book/flight.state';
import { CustomCalendarComponent } from '../../shared/custom-calendar/custom-calendar.component';
import * as moment from 'moment';

@Component({
  selector: 'app-passenger-detail',
  templateUrl: './passenger-detail.component.html',
  styleUrls: ['./passenger-detail.component.scss'],
})
export class PassengerDetailComponent implements OnInit {


  Passenger: FormGroup;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.Passenger = new FormGroup({
      "Title": new FormControl(null),
      "FirstName": new FormControl(null),
      "LastName": new FormControl(null),
      "DateOfBirth": new FormControl(null),
      "ContactNo": new FormControl(null),
      "PassportNo": new FormControl(null),
      "PassportExpiry": new FormControl(null),
      "nationality": new FormControl(null),
      "ftnumber": new FormControl(null)
    });
   }
  
  async addMeal() {
    const modal = await this.modalCtrl.create({
      component: MealBaggageComponent,
      id: 'passenger-meal'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  async getCalendar(title) {

    const options: CalendarModalOptions = {
      title: title,
      pickMode: 'single',
      color: 'dark',
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: Date.now()
    }

    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: {
        options
      }
    });

    modal.present();

    const event: any = await modal.onDidDismiss();
    if (title == 'Date Of Birth') {
      let calendarResult: CalendarResult = event.data.dateObj;
      console.log(calendarResult);
      this.Passenger.controls["dob"].setValue(moment(calendarResult.dateObj).format('YYYY-MM-DD hh:mm:ss A Z'));
    }
    else if (title == 'Passport Expiry Date') {
      let calendarResult: CalendarResult = event.data.dateObj;
      console.log(calendarResult);
      this.Passenger.controls["ppexpdate"].setValue(moment(calendarResult.dateObj).format('YYYY-MM-DD hh:mm:ss A Z'));
    }
  

  }

  async getCustomCalendar() {

    const options = {
      from: new Date(),
      to: 0,
      color: 'dark',
      pickMode: 'single',
      showToggleButtons: true,
      showMonthPicker: true,
      monthPickerFormat: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      defaultTitle: 'None',
      defaultSubtitle: 'Sub None',
      disableWeeks: [],
      monthFormat: 'MMM YYYY',
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      weekStart: 0
    }

    const modal = await this.modalCtrl.create({
      component: CustomCalendarComponent,
      componentProps: {
        options
      }
    });

    modal.present();

    const event: any = await modal.onDidDismiss();
    this.Passenger.controls["dob"].setValue(event.data.dateObj);
  }

  addPassenger() {
    this.store.dispatch(new AddPassenger(this.Passenger.value));
  }

  dismissDetail() {
    this.modalCtrl.dismiss(null, null, 'passenger-details');
  }

}
