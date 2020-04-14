import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AboutHotelComponent } from '../about-hotel/about-hotel.component';

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss'],
})
export class ViewHotelComponent implements OnInit {

  rules: any[] = ["1","2","3","4"];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  async showAll() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement:'hotel-rules'
      }
    });

    return await modal.present();
  }

  async readMore() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'about-hotel'
      }
    });

    return await modal.present();
  }

}
