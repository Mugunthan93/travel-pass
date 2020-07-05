import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk } from 'src/app/stores/book/flight.state';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';
import { MultiCityBookState } from 'src/app/stores/book/flight/multi-city.state';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';
import { RoundTripSearch, RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { InternationalBookState } from 'src/app/stores/book/flight/international.state';

@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {

  flightDetail: Observable<bookObj>;
  adult: Observable<number>;

  constructor(
    private store: Store,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.adult = this.store.select(RoundTripSearchState.getAdult);
    this.flightDetail = this.store.select(InternationalBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
      id: 'passenger-info'
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
      component: BookConfirmationComponent,
      keyboardClose:false
    });

    return await modal.present();
  }

}
