import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  bookHeight: string = "45px";
  passengers: any;

  constructor(
    public modalCtrl : ModalController
  ) {
  }

  ngOnInit() {
  }

  FairValue(value : any) {
    console.log(value);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
      componentProps: {
        passengers: this.passengers
      },
      id:'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

}
