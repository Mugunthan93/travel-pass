import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/passenger-info/passenger-info.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  bookHeight: string = "45px";
  panels: any[] = [
    "trip 1",
    "trip 2",
    "trip 3",
    "trip 4",
    "trip 5",
    "trip 6"
  ];
  passengers: any;

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  FairValue(value: any) {
    console.log(value);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
      componentProps: {
        passengers: this.passengers
      },
      id: 'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

}
