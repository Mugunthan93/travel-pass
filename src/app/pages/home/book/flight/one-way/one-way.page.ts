import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk } from 'src/app/stores/book/flight.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';
import { OneWayBookState } from 'src/app/stores/book/flight/oneway.state';
import { BookConfirmationComponent } from 'src/app/components/flight/book-confirmation/book-confirmation.component';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {
  
  flightDetail: Observable<bookObj>;
  adult: Observable<number>;

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
    this.adult = this.store.select(OneWaySearchState.getAdult);
    this.flightDetail = this.store.select(OneWayBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));

    this.selected$ = this.store.select(FlightPassengerState.getSelected);
    this.count$ = this.store.select(FlightPassengerState.getCount);

    this.selected$.subscribe(select => this.selected = select);
    this.count$.subscribe(count => this.count = count);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
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

    if (this.selected == this.count) {

      const modal = await this.modalCtrl.create({
        component: BookConfirmationComponent,
        id: 'send-request',
        keyboardClose: false
      });
  
      return await modal.present();

    }
    else {

    const alert = await this.alertCtrl.create({
      header: 'Passenger Details',
      subHeader:'Select Your Passenger',
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
