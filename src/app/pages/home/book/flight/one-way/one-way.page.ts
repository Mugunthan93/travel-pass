import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk } from 'src/app/stores/book/flight.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';
import { OneWayBookState } from 'src/app/stores/book/flight/oneway.state';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {
  
  flightDetail: Observable<bookObj>;
  adult: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {
    this.adult = this.store.select(OneWaySearchState.getAdult);
    this.flightDetail = this.store.select(OneWayBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
      keyboardClose: false,
      id:'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  radioSelect(evt: CustomEvent) {
    this.store.dispatch(new CancellationRisk(evt.detail.value));
  }

  async confirmRequest() {
    const modal = await this.modalCtrl.create({
      component: BookConfirmationComponent
    });

    return await modal.present();
  }

}
