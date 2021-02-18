import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusReviewComponent } from '../bus-review/bus-review.component';
import { BusPhotoComponent } from '../bus-photo/bus-photo.component';
import { BusAmentiesComponent } from '../bus-amenties/bus-amenties.component';
import { BusPolicyComponent } from '../bus-policy/bus-policy.component';
import { PickDropPointComponent } from '../pick-drop-point/pick-drop-point.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { seat, BusResultState } from 'src/app/stores/result/bus.state';

@Component({
  selector: 'app-seat-select',
  templateUrl: './seat-select.component.html',
  styleUrls: ['./seat-select.component.scss'],
})
export class SeatSelectComponent implements OnInit {

  selectedSeats$: Observable<seat[]>;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) {
    this.selectedSeats$ = this.store.select(BusResultState.getselectedSeat);
  }

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
      component: BusPolicyComponent,
      id:'bus-policy'
    });

    return await modal.present();
  }

  async pickupdrop() {
    const modal = await this.modalCtrl.create({
      component: PickDropPointComponent,
      id : 'pick-drop'
    });

    return await modal.present();
  }

  async dismiss() {
    return await this.modalCtrl.dismiss(null, null,'seat-select');
  }

}
