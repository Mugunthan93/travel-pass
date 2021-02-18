import { Component, OnInit } from '@angular/core';
import { bookObj, summary, CancellationRisk, FLightBookState } from 'src/app/stores/book/flight.state';
import { ModalController, AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { DomesticBookState } from 'src/app/stores/book/flight/domestic.state';
import { Observable } from 'rxjs';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit {

  depFlightDetail: bookObj;
  reFlightDetail: bookObj;
  flightSummary: summary;
  adult: number;

  selected$: Observable<number>;
  count$: Observable<number>;

  selected: number;
  count: number;

  constructor(
    public modalCtrl: ModalController,
    private store: Store,
    public alertCtrl: AlertController
  ) {
  }

  ngOnInit() {
    this.adult = this.store.selectSnapshot(RoundTripSearchState.getAdult);
    this.depFlightDetail = this.store.selectSnapshot(DomesticBookState.getDepartureFlightDetail);
    this.reFlightDetail = this.store.selectSnapshot(DomesticBookState.getReturnFlightDetail);

    this.flightSummary = this.depFlightDetail.summary;

    this.selected$ = this.store.select(FlightPassengerState.getSelected);
    this.count$ = this.store.select(FlightPassengerState.getCount);

    this.selected$.subscribe(select => this.selected = select);
    this.count$.subscribe(count => this.count = count);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose:false,
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
    if (this.selected == this.count) {
      const modal = await this.modalCtrl.create({
        component: BookConfirmationComponent,
        id: 'book-confirm',
        keyboardClose: false
      });

      return await modal.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Passenger Details',
        subHeader: 'Select Your Passenger',
        id: 'passenger-check',
        buttons: [{
          text: "Ok",
          handler: () => {
            alert.dismiss();
          }
        }]
      });
      return await alert.present();
    }
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
