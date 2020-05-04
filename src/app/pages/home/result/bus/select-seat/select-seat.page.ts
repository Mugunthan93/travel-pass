import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusReviewComponent } from 'src/app/components/bus/bus-review/bus-review.component';
import { BusPhotoComponent } from 'src/app/components/bus/bus-photo/bus-photo.component';
import { BusAmentiesComponent } from 'src/app/components/bus/bus-amenties/bus-amenties.component';
import { BusPolicyComponent } from 'src/app/components/bus/bus-policy/bus-policy.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-seat',
  templateUrl: './select-seat.page.html',
  styleUrls: ['./select-seat.page.scss'],
})
export class SelectSeatPage implements OnInit {

  continue: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public router: Router
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

  selectedSeat(evt) {
    if (evt) {
      this.continue = evt;
    }
  }

  pickupdrop() {
    this.router.navigate(['/', 'home', 'result', 'bus','select-drop-and-pickup']);
  }

}
