import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { Observable } from 'rxjs';
import { FlightResultState } from 'src/app/stores/result/flight.state';
import { Store } from '@ngxs/store';
import { ResultState } from 'src/app/stores/result.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { hotelForm, HotelSearchState } from 'src/app/stores/search/hotel.state';
import { HotelResultState } from 'src/app/stores/result/hotel.state';
import { busform, BusSearchState } from 'src/app/stores/search/bus.state';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';
import { FlightFilterComponent } from 'src/app/components/flight/flight-filter/flight-filter.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
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

  constructor(
    private store:Store,
    public modalCtrl : ModalController
  )
  {

  }

  ngOnInit() {

    this.resultMode$ = this.store.select(ResultState.getResultMode);
    this.resultType$ = this.store.select(ResultState.getResultType);

    this.resultMode = this.store.selectSnapshot(ResultState.getResultMode);
    this.resultType = this.store.selectSnapshot(ResultState.getResultType);

    this.mailStatus$ = this.store.select(FlightResultState.mailStatus);

    this.hotelSearch$ = this.store.select(HotelSearchState.getSearchData);
    this.totalGuest$ = this.store.select(HotelSearchState.getGuest);
    this.totalHotels$ = this.store.select(HotelResultState.totalResult);

    this.busSearch$ = this.store.select(BusSearchState.getSearchData);

  }

  back() {
    this.store.dispatch(new StateReset(ResultState));
    if (this.resultType == 'animated-round-trip') {
      this.resultType = 'round-trip';
    }
    if (this.resultMode == 'flight') {     
      this.store.dispatch(new Navigate(['/', 'home', 'search', this.resultMode,this.resultType]));
    }
    else {
      this.store.dispatch(new Navigate(['/', 'home', 'search', this.resultMode]));
    }
  }

  async flightFilter() {
    const modal = await this.modalCtrl.create({
      component: FlightFilterComponent
    });

    return modal.present();
  }

  async hotelFilter() {
    const modal = await this.modalCtrl.create({
      component: HotelFilterComponent
    });

    return modal.present();
  }

  async busFilter() {
    const modal = await this.modalCtrl.create({
      component: BusFilterComponent
    });

    return modal.present();
  }


  async mailTicket() {
    const modal = await this.modalCtrl.create({
      component: EmailItineraryComponent,
      cssClass:'emailitinerary'
    });

    return modal.present();
  }

}
