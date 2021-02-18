import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { DomesticResultState, SelectedDepartureFlight, SelectedReturnFlight } from 'src/app/stores/result/flight/domestic.state';
import { Observable } from 'rxjs';
import { resultObj, FlightResultState } from 'src/app/stores/result/flight.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/domestic.state';

@Component({
  selector: "app-domestic",
  templateUrl: "./domestic.page.html",
  styleUrls: ["./domestic.page.scss"],
})
export class DomesticPage implements OnInit {
  departList$: Observable<resultObj[]>;
  returnList$: Observable<resultObj[]>;
  selectedDepartureFlight$: Observable<resultObj>;
  selectedReturnFlight$: Observable<resultObj>;
  flightType$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.departList$ = this.store.select(
      DomesticResultState.getDomesticDepartureRoundTrip
    );
    this.returnList$ = this.store.select(
      DomesticResultState.getDomesticReturnRoundTrip
    );

    this.selectedDepartureFlight$ = this.store.select(
      DomesticResultState.getSelectedDepartureFlight
    );
    this.selectedReturnFlight$ = this.store.select(
      DomesticResultState.getSelectedReturnFlight
    );

    this.flightType$ = this.store.select(FlightResultState.getFlightType);
  }

  currentDepartureFlight(flight: resultObj) {
    this.store.dispatch(new SelectedDepartureFlight(flight));
  }

  currentReturnFlight(flight: resultObj) {
    this.store.dispatch(new SelectedReturnFlight(flight));
  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }
}
