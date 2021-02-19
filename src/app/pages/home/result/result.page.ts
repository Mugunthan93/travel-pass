import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { Observable } from 'rxjs';
import { FlightResultState, ChangeFlightType } from 'src/app/stores/result/flight.state';
import { Store } from '@ngxs/store';
import { ResultState, ResultBack } from 'src/app/stores/result.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { hotelForm, HotelSearchState } from 'src/app/stores/search/hotel.state';
import { HotelResultState } from 'src/app/stores/result/hotel.state';
import { busform, BusSearchState } from 'src/app/stores/search/bus.state';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';
import { FlightFilterComponent } from 'src/app/components/flight/flight-filter/flight-filter.component';
import { sortButton } from 'src/app/stores/result/sort.state';
import { SearchState } from 'src/app/stores/search.state';
import { PassengerState } from 'src/app/stores/passenger.state';
import { BusPassengerState } from 'src/app/stores/passenger/bus.passenger.state';
import { FlightPassengerState } from 'src/app/stores/passenger/flight.passenger.states';
import { HotelPassengerState } from 'src/app/stores/passenger/hotel.passenger.state';
import { TrainPassengerState } from 'src/app/stores/passenger/train.passenger.state';

@Component({
  selector: "app-result",
  templateUrl: "./result.page.html",
  styleUrls: ["./result.page.scss"],
})
export class ResultPage implements OnInit {
  mailStatus$: Observable<boolean>;
  resultMode$: Observable<string>;
  resultType$: Observable<string>;

  resultMode: string;
  resultType: string;

  hotelSearch$: Observable<hotelForm>;
  totalGuest$: Observable<number>;
  totalHotels$: Observable<number>;
  busSearch$: Observable<busform>;

  loading$: Observable<number>;
  flightType$: Observable<string>;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private changeDet: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.store.dispatch(new StateReset(PassengerState,FlightPassengerState,BusPassengerState,HotelPassengerState,TrainPassengerState));

    this.resultMode$ = this.store.select(ResultState.getResultMode);
    this.resultType$ = this.store.select(ResultState.getResultType);

    this.resultMode = this.store.selectSnapshot(ResultState.getResultMode);
    this.resultType = this.store.selectSnapshot(ResultState.getResultType);

    this.flightType$ = this.store.select(FlightResultState.getFlightType);
    this.mailStatus$ = this.store.select(FlightResultState.mailStatus);

    this.hotelSearch$ = this.store.select(HotelSearchState.getSearchData);
    this.totalGuest$ = this.store.select(HotelSearchState.getGuest);
    this.totalHotels$ = this.store.select(HotelResultState.totalResult);
    this.loading$ = this.store.select(HotelResultState.getLoading);

    this.busSearch$ = this.store.select(BusSearchState.getSearchData);
  }


  ionViewWillEnter() {
    console.log(this.changeDet);
    this.changeDet.detectChanges();
  }

  async changeResult(evt: CustomEvent) {
    let loading = await this.loadingCtrl.create({
      message: 'loading ' + evt.detail.value + ' list'
    });
    await loading.present();
    this.store.dispatch(new ChangeFlightType(evt.detail.value))
      .subscribe({
        complete: async () => {
          await loading.dismiss();
        }
      });
  }

  back() {
    this.store.dispatch(new ResultBack());
  }

  async flightFilter() {
    const modal = await this.modalCtrl.create({
      component: FlightFilterComponent,
    });

    return modal.present();
  }

  async hotelFilter() {
    const modal = await this.modalCtrl.create({
      component: HotelFilterComponent,
      id: "hotel-filter",
    });

    return modal.present();
  }

  async busFilter() {
    const modal = await this.modalCtrl.create({
      component: BusFilterComponent,
    });

    return modal.present();
  }

  async mailTicket() {
    const modal = await this.modalCtrl.create({
      component: EmailItineraryComponent,
      cssClass: "emailitinerary",
    });

    return modal.present();
  }
}
