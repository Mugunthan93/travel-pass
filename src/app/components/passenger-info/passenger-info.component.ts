import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerDetailComponent } from '../passenger-detail/passenger-detail.component';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.scss'],
})
export class PassengerInfoComponent implements OnInit {

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  async getDetail() {
      const modal = await this.modalCtrl.create({
        component: PassengerDetailComponent,
        id: 'passenger-details'
      });

      modal.onDidDismiss().then(
        (resData) => {
          console.log(resData);
        }
      );

      return await modal.present();
  }

  dismissInfo() {
    this.modalCtrl.dismiss(null, null,'passenger-info');
  }

}
