import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddPassenger } from 'src/app/stores/book/flight.state';

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
      "title": new FormControl(null),
      "firstname": new FormControl(null),
      "lastname": new FormControl(null),
      "dob": new FormControl(null),
      "ppnumber": new FormControl(null),
      "nationality": new FormControl(null),
      "ppexpdate": new FormControl(null),
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
      this.Passenger.controls["dob"].setValue(event.data.dateObj);
    }
    else if (title == 'Passport Expiry Date') {
      this.Passenger.controls["ppexpdate"].setValue(event.data.dateObj);
    }
  

  }

  addPassenger() {
    this.store.dispatch(new AddPassenger(this.Passenger.value));
  }



  dismissDetail() {
    this.modalCtrl.dismiss(null, null, 'passenger-details');
  }

}
