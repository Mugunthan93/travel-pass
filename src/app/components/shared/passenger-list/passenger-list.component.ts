import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { PassengerDetailComponent } from '../../flight/passenger-detail/passenger-detail.component';
import * as _ from 'lodash';
import { BookState } from 'src/app/stores/book.state';
import { flightpassenger, FlightPassengerState, SelectPassenger, DeselectPassenger, DeletePassenger, DismissFlightPassenger } from 'src/app/stores/passenger/flight.passenger.states';
import { DismissHotelPassenger, HotelPassengerState, hotelpassenger } from 'src/app/stores/passenger/hotel.passenger.state';
import { AddGuestComponent } from '../../hotel/add-guest/add-guest.component';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.scss'],
})
export class PassengerListComponent implements OnInit {

  bookMode$: Observable<string>;
  bookMode: string;

  passengers$: Observable<flightpassenger[]>;
  selectedPassengers$: Observable<flightpassenger[]>;
  selected$: Observable<number>;
  count$: Observable<number>;

  hotelAdult$: Observable<hotelpassenger[]>;
  selectAdult$: Observable<hotelpassenger[]>;
  selectedAdult$: Observable<number>;
  totalAdult$: Observable<number>;

  hotelChildren$: Observable<hotelpassenger[]>;
  selectChildren$: Observable<hotelpassenger[]>;
  selectedChildren$: Observable<number>;
  totalChildren$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private store: Store
  ) { }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);
    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);

    this.passengers$ = this.store.select(FlightPassengerState.getPassengers);
    this.selectedPassengers$ = this.store.select(FlightPassengerState.getSelectedPassengers);
    this.selected$ = this.store.select(FlightPassengerState.getSelected);
    this.count$ = this.store.select(FlightPassengerState.getCount);

    this.hotelAdult$ = this.store.select(HotelPassengerState.GetAdult);
    this.selectAdult$ = this.store.select(HotelPassengerState.GetSelectAdult);
    this.totalAdult$ = this.store.select(HotelPassengerState.GetTotalAdult);
    this.selectedAdult$ = this.store.select(HotelPassengerState.GetSelectedAdult);


    this.hotelChildren$ = this.store.select(HotelPassengerState.GetChild);
    this.selectChildren$ = this.store.select(HotelPassengerState.GetSelectChildren);
    this.totalChildren$ = this.store.select(HotelPassengerState.GetTotalChildren);
    this.selectedChildren$ = this.store.select(HotelPassengerState.GetSelectedChildren);

  }

  async getDetail(type : number) {

    if (this.bookMode == 'flight') {
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
    else if (this.bookMode == 'hotel') {
      const modal = await this.modalCtrl.create({
        component: AddGuestComponent,
        componentProps: {
          form: 'add',
          pax: null,
          paxtype: type
        },
        id: 'guest-details'
      });

      return await modal.present();
    }

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

  dismissInfo() {
    if (this.bookMode == 'flight') {
      this.store.dispatch(new DismissFlightPassenger());
    }
    else if (this.bookMode == 'hotel') {
      this.store.dispatch(new DismissHotelPassenger());
    }
  }

}
