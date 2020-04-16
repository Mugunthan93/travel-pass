import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AboutHotelComponent } from '../about-hotel/about-hotel.component';
import { HotelLocationComponent } from '../hotel-location/hotel-location.component';

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss'],
})
export class ViewHotelComponent implements OnInit {

  tiles : any = [
    { cols: 1, rows: 3, img: "../../../../assets/img/hotel/hotel-1.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-2.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-3.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-4.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-5.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-6.jpeg" },
    { cols: 1, rows: 1, color: '#3d9ed7' }
  ];

  rules: any[] = ["1", "2", "3", "4"];

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

  async viewLocation() {
    const modal = await this.modalCtrl.create({
      component: HotelLocationComponent
    });
    return await modal.present();
  }

}
