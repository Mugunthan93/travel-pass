import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { bookObj, CancellationRisk, summary } from 'src/app/stores/book/flight.state';
import { Store } from '@ngxs/store';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';
import { RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { DomesticBookState } from 'src/app/stores/book/flight/domestic.state';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  depFlightDetail: bookObj;
  reFlightDetail: bookObj;
  flightSummary: summary;
  adult: number;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.adult = this.store.selectSnapshot(RoundTripSearchState.getAdult);
    this.depFlightDetail = this.store.selectSnapshot(DomesticBookState.getDepartureFlightDetail);
    this.reFlightDetail = this.store.selectSnapshot(DomesticBookState.getReturnFlightDetail);

    this.flightSummary = this.depFlightDetail.summary;
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

  changeSummary(evt: CustomEvent) {
    console.log(evt);
    if (evt.detail.value == 'onward') {
      this.flightSummary = this.depFlightDetail.summary;

    }
    else if (evt.detail.value == 'return') {
      this.flightSummary = this.reFlightDetail.summary;
    }
  }

}
