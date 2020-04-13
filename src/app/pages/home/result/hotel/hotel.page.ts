import { Component, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  hotelHeight: string;

  hotelList: any[] = ["1", "2", "3", "4", "5", "6","1", "2", "3", "4", "5", "6"];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.hotelHeight = "auto";
  }

  img(val) {
    console.log(val);
  }

  async hotelFilter() {
    const modal = await this.modalCtrl.create({
      component: HotelFilterComponent,
      id:'hotel-filter'
    });

    modal.onDidDismiss().then(
      (filterData) => {
        console.log(filterData);
      }
    );

    return await modal.present();
  }

}
