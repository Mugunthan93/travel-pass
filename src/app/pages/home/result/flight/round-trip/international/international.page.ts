import { Component, OnInit } from '@angular/core';
import { resultObj, sortButton } from 'src/app/stores/result/flight.state';
import { Observable, Subscription } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { InternationalResultState, DepartureSort, ArrivalSort, DurationSort, PriceSort, SelectedFlight } from 'src/app/stores/result/flight/international.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/international.state';

@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {

  constructor(
    private store: Store,
    public modalCtrl: ModalController
  ) { }

  flightList$: Observable<resultObj[]>;
  selectedFlight$: Observable<resultObj>;

  ngOnInit() {
    this.flightList$ = this.store.select(InternationalResultState.getInternationalRoundTrip);
    this.selectedFlight$ = this.store.select(InternationalResultState.getSelectedFlight);
  }

  currentFlight(result: resultObj) {
    this.store.dispatch(new SelectedFlight(result));
  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }

}
