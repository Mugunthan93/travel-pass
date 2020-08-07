import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BusReviewComponent } from '../bus-review/bus-review.component';
import { BusPhotoComponent } from '../bus-photo/bus-photo.component';
import { BusAmentiesComponent } from '../bus-amenties/bus-amenties.component';
import { BusPolicyComponent } from '../bus-policy/bus-policy.component';
import { PickDropPointComponent } from '../pick-drop-point/pick-drop-point.component';

@Component({
  selector: 'app-seat-select',
  templateUrl: './seat-select.component.html',
  styleUrls: ['./seat-select.component.scss'],
})
export class SeatSelectComponent implements OnInit {

  continue: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async busReview() {
    const modal = await this.modalCtrl.create({
      component: BusReviewComponent
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

  selectedSeat(evt) {
    if (evt) {
      this.continue = evt;
    }
  }

  async pickupdrop() {
    const modal = await this.modalCtrl.create({
      component: PickDropPointComponent,
      id : 'pick-drop'
    });

    return await modal.present();
  }

}
