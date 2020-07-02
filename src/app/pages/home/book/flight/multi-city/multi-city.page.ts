import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk } from 'src/app/stores/book/flight.state';
import { MultiCitySearch, MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';
import { Store } from '@ngxs/store';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';
import { MultiCityBookState } from 'src/app/stores/book/flight/multi-city.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  flightDetail: Observable<bookObj>;
  adult: Observable<number>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.adult = this.store.select(MultiCitySearchState.getAdult);
    this.flightDetail = this.store.select(MultiCityBookState.getFlightDetail);
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
      component: BookConfirmationComponent
    });

    return await modal.present();
  }

}
