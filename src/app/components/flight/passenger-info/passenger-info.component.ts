import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PassengerDetailComponent } from '../passenger-detail/passenger-detail.component';
import { Store } from '@ngxs/store';
import { FLightBookState, passenger, SelectPassenger, DeselectPassenger, DeletePassenger } from 'src/app/stores/book/flight.state';
import { Observable } from 'rxjs';
import { SearchState } from 'src/app/stores/search.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';
import { RoundTripSearchState } from 'src/app/stores/search/flight/round-trip.state';
import { MultiCitySearchState } from 'src/app/stores/search/flight/multi-city.state';
import * as _ from 'lodash';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.scss'],
})
export class PassengerInfoComponent implements OnInit {

  passengers$: Observable<passenger[]>;
  selectedPassengers$: Observable<passenger[]>;
  selected$: Observable<number>;
  count$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private store : Store
  ) { }

  ngOnInit() {

    this.passengers$ = this.store.select(FLightBookState.getPassengers);
    this.selectedPassengers$ = this.store.select(FLightBookState.getSelectedPassengers);
    this.selected$ = this.store.select(FLightBookState.getSelected);
    this.count$ = this.store.select(FLightBookState.getCount);
    
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

  async editPassenger(pax: passenger) {
    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'edit',
        pax : pax
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

  deletePassneger(pax : passenger) {
    this.store.dispatch(new DeletePassenger(pax));
  }

  gender(pax: passenger): string {
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
      async (passenger: passenger[]) => {

        if (this.passportValidation() == 'international') {

          let missing = await this.alertCtrl.create({
            header: 'Lead Detail Missing',
            subHeader : 'Passport Number or Expiry Date missing',
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
          this.modalCtrl.dismiss(null, null,'passenger-info');
        }
      }
    );

  }

}
