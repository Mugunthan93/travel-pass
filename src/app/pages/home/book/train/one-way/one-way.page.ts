import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { trainonewayform, TrainOneWaySearchState } from 'src/app/stores/search/train/oneway.state';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { GetTrainName } from 'src/app/stores/book/train/one-way.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  onewayForm: Observable<trainonewayform>;
  requestSubmit: boolean = false;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.onewayForm = this.store.select(TrainOneWaySearchState.getOnewaySearch);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose: false,
      id: 'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  trainname(evt : CustomEvent) {
    this.store.dispatch(new GetTrainName(evt.detail.value));
  }

  errorClass(value: string) {
    return {
      'initial': (value == null) && !this.requestSubmit,
      'valid': (value !== null && value !== "") && this.requestSubmit,
      'invalid':(value == null && value == "") && this.requestSubmit
    }
  }

  sendRequest() {
    this.requestSubmit = true;
  }

}
