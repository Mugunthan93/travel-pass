import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj, sortButton, ResetEmailDetail } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { DepartureSort, ArrivalSort, DurationSort, PriceSort, OneWayResultState, SelectedFlight } from 'src/app/stores/result/flight/oneway.state';
import { OneWaySendRequest, GetFareQuoteSSR } from 'src/app/stores/book/flight/oneway.state';
import { GetAirlines } from 'src/app/stores/result/filter.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  flightList$: Observable<resultObj[]>;
  selectedFlight$: Observable<resultObj>;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store:Store
  ) {
  }
  
  ngOnInit() {

    this.store.dispatch(new ResetEmailDetail());
    this.flightList$ = this.store.select(OneWayResultState.getOneWay);
    this.selectedFlight$ = this.store.select(OneWayResultState.getSelectedFlight);

  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }

  currentFlight(flight : resultObj) {
    this.store.dispatch(new SelectedFlight(flight));
  }
}
