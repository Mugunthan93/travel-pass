import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk, FLightBookState } from 'src/app/stores/book/flight.state';
import { Store } from '@ngxs/store';
import { ModalController, AlertController } from '@ionic/angular';
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

  selected$: Observable<number>;
  count$: Observable<number>;

  selected: number;
  count: number;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.adult = this.store.select(RoundTripSearchState.getAdult);
    this.flightDetail = this.store.select(InternationalBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));

    this.selected$ = this.store.select(FLightBookState.getSelected);
    this.count$ = this.store.select(FLightBookState.getCount);

    this.selected$.subscribe(select => this.selected = select);
    this.count$.subscribe(count => this.count = count);
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
    if (this.selected == this.count) {
      const modal = await this.modalCtrl.create({
        component: BookConfirmationComponent,
        id: 'send-request',
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

}
