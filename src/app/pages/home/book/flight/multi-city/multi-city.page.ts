import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { Observable } from 'rxjs';
import { bookObj, CancellationRisk, FLightBookState } from 'src/app/stores/book/flight.state';
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

    this.selected$ = this.store.select(FLightBookState.getSelected);
    this.count$ = this.store.select(FLightBookState.getCount);

    this.selected$.subscribe(select => this.selected = select);
    this.count$.subscribe(count => this.count = count);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
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
