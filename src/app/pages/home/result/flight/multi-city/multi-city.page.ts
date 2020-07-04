import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { flightResult } from 'src/app/models/search/flight';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj, sortButton } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { MultiCityResultState, SelectedFlight, DepartureSort, ArrivalSort, DurationSort, PriceSort } from 'src/app/stores/result/flight/multi-city.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/multi-city.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  flightList$: Observable<resultObj[]>;
  selectedFlight: Observable<resultObj>;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store: Store
  ) {
  }
  
  ngOnInit() {
    this.flightList$ = this.store.select(MultiCityResultState.getMultiWay);
    this.selectedFlight = this.store.select(MultiCityResultState.getSelectedFlight);
  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }

  currentFlight(flight : resultObj){
    this.store.dispatch(new SelectedFlight(flight));
  }

}
