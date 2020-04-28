import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusReviewComponent } from 'src/app/components/bus/bus-review/bus-review.component';
import { BusPhotoComponent } from 'src/app/components/bus/bus-photo/bus-photo.component';
import { BusAmentiesComponent } from 'src/app/components/bus/bus-amenties/bus-amenties.component';
import { BusPolicyComponent } from 'src/app/components/bus/bus-policy/bus-policy.component';

@Component({
  selector: 'app-select-seat',
  templateUrl: './select-seat.page.html',
  styleUrls: ['./select-seat.page.scss'],
})
export class SelectSeatPage implements OnInit {

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  async busReview() {
    const modal = await this.modalCtrl.create({
      component : BusReviewComponent
    });

    return await modal.present();
  }

  async busPhoto() {
    const modal = await this.modalCtrl.create({
      component: BusPhotoComponent
    });

    return await modal.present();
  }

  async budAmenties() {
    const modal = await this.modalCtrl.create({
      component: BusAmentiesComponent
    });

    return await modal.present();
  }

  async busPolicy() {
    const modal = await this.modalCtrl.create({
      component: BusPolicyComponent
    });

    return await modal.present();
  }

}
