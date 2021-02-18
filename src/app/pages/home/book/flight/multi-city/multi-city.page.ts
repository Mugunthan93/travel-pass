import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk } from 'src/app/stores/book/flight.state';
import { MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';
import { Store } from '@ngxs/store';
import { MultiCityBookState } from 'src/app/stores/book/flight/multi-city.state';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

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
    this.adult = this.store.select(MultiCitySearchState.getAdult);
    this.flightDetail = this.store.select(MultiCityBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));

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

}
