import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealBaggageComponent } from '../meal-baggage/meal-baggage.component';

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

  dismissDetail() {
    this.modalCtrl.dismiss(null, null, 'passenger-details');
  }

}
