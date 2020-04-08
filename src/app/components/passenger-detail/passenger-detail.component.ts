import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';

@Component({
  selector: 'app-passenger-detail',
  templateUrl: './passenger-detail.component.html',
  styleUrls: ['./passenger-detail.component.scss'],
})
export class PassengerDetailComponent implements OnInit {

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
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
    console.log(event);
  }



  dismissDetail() {
    this.modalCtrl.dismiss(null, null, 'passenger-details');
  }

}
