import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FLightBookState } from 'src/app/stores/book/flight.state';
import { ModalController, AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { PassengerDetailComponent } from '../../flight/passenger-detail/passenger-detail.component';
import { SearchState } from 'src/app/stores/search.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';
import { RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';
import * as _ from 'lodash';
import { BookState } from 'src/app/stores/book.state';
import { flightpassenger, FlightPassengerState, SelectPassenger, DeselectPassenger, DeletePassenger } from 'src/app/stores/passenger/flight.passenger.states';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.scss'],
})
export class PassengerListComponent implements OnInit {

  bookMode$: Observable<string>;

  passengers$: Observable<flightpassenger[]>;
  selectedPassengers$: Observable<flightpassenger[]>;
  selected$: Observable<number>;
  count$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private store: Store
  ) { }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);

    this.passengers$ = this.store.select(FlightPassengerState.getPassengers);
    this.selectedPassengers$ = this.store.select(FlightPassengerState.getSelectedPassengers);
    this.selected$ = this.store.select(FlightPassengerState.getSelected);
    this.count$ = this.store.select(FlightPassengerState.getCount);

  }

  async getDetail() {
    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'add',
        pax: null
      },
      id: 'passenger-details'
    });

    return await modal.present();
  }

  async editPassenger(pax: flightpassenger) {
    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'edit',
        pax: pax
      },
      id: 'passenger-details'
    });

    return await modal.present();
  }

  getPass(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeselectPassenger(evt.detail.value));
    }
  }

  deletePassneger(pax: flightpassenger) {
    this.store.dispatch(new DeletePassenger(pax));
  }

  gender(pax: flightpassenger): string {
    if (pax.Gender == null) {
      switch (pax.Title) {
        case 'Mr': return 'Male';
        case 'Mstr': return 'Male';
        case 'Ms': return 'Female';
        case 'Mrs': return 'Female';
      }
    }
    switch (pax.Gender) {
      case 1: return 'Male';
      case 2: return 'Female';
    }
  }

  passportValidation(): string {
    switch (this.store.selectSnapshot(SearchState.getSearchType)) {
      case 'one-way': return this.store.selectSnapshot(OneWaySearchState.getTripType); break;
      case 'round-trip': return this.store.selectSnapshot(RoundTripSearchState.getTripType); break;
      case 'multi-city': return this.store.selectSnapshot(MultiCitySearchState.getTripType); break;
    }
  }

  dismissInfo() {
    this.selectedPassengers$.subscribe(
      async (passenger: flightpassenger[]) => {

        if (this.passportValidation() == 'international') {

          let missing = await this.alertCtrl.create({
            header: 'Lead Detail Missing',
            subHeader: 'Passport Number or Expiry Date missing',
            id: 'passenger-check',
            buttons: [{
              text: "Ok",
              handler: () => {
                missing.dismiss();
              }
            }]
          });

          if (_.isNull(passenger[0].PassportNo) || _.isNull(passenger[0].PassportExpiry)) {
            return await missing.present();
          }

        }
        else {
          this.modalCtrl.dismiss(null, null, 'passenger-info');
        }
      }
    );

  }

}
