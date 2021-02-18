import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { ResultState } from 'src/app/stores/result.state';
import { FlightFilterState, flightFilter, SetFlightStops, SetFlightDeparture, SetFlightArrival, SetFlightPrice, SetFlightCorpFare, SetFlightAirlines, ResetFlightAirlines } from 'src/app/stores/result/filter/flight.filter.state';
import { DepartureFilterState, SetDepStops, SetDepDeparture, SetDepArrival, SetDepPrice, SetDepCorpFare, SetDepAirlines, ResetDepartureAirlines } from 'src/app/stores/result/filter/departure.filter.state';
import { ReturnFilterState, SetReStops, SetReDeparture, SetReArrival, SetRePrice, SetReCorpFare, SetReAirlines, ResetReturnAirlines } from 'src/app/stores/result/filter/return.filter.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss'],
})
export class FlightFilterComponent implements OnInit {

  flightType: string;
  type: string = 'departure';

  inputs: flightFilter;
  departure: flightFilter;
  return: flightFilter;

  inputs$: Observable<flightFilter>;
  departure$: Observable<flightFilter>;
  return$: Observable<flightFilter>;


  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.flightType = this.store.selectSnapshot(ResultState.getResultType);

    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.departure = this.store.selectSnapshot(DepartureFilterState.getFlightFilter);
        this.departure$ = this.store.select(DepartureFilterState.getFlightFilter); 
      }
      else if (this.type == 'return') {
        this.return = this.store.selectSnapshot(ReturnFilterState.getFlightFilter);
        this.return$ = this.store.select(ReturnFilterState.getFlightFilter);
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.inputs = this.store.selectSnapshot(FlightFilterState.getFlightFilter);
      this.inputs$ = this.store.select(FlightFilterState.getFlightFilter);
    }
    
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  changeType(evt : CustomEvent) {
    this.type = evt.detail.value;
    if (this.type == 'departure') {
      this.departure = this.store.selectSnapshot(DepartureFilterState.getFlightFilter);
      this.departure$ = this.store.select(DepartureFilterState.getFlightFilter);
    }
    else if (this.type == 'return') {
      this.return = this.store.selectSnapshot(ReturnFilterState.getFlightFilter);
      this.return$ = this.store.select(ReturnFilterState.getFlightFilter);
    }
  }

  chooseStop(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepStops(parseInt(evt.detail.value)));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetReStops(parseInt(evt.detail.value)));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightStops(parseInt(evt.detail.value)));
    }
  }

  depRange(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepDeparture(evt.detail.value));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetReDeparture(evt.detail.value));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightDeparture(evt.detail.value));
    }
  }

  reRange(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepArrival(evt.detail.value));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetReArrival(evt.detail.value));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightArrival(evt.detail.value));
    }
  }

  priceRange(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepPrice(evt.detail.value));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetRePrice(evt.detail.value));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightPrice(evt.detail.value));
    }
  }

  corpFare(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepCorpFare(evt.detail.checked));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetReCorpFare(evt.detail.checked));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightCorpFare(evt.detail.checked));
    }
  }

  chooseAirline(evt: CustomEvent) {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(new SetDepAirlines(evt.detail.value, evt.detail.checked));
      }
      else if (this.type == 'return') {
        this.store.dispatch(new SetReAirlines(evt.detail.value, evt.detail.checked));
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(new SetFlightAirlines(evt.detail.value, evt.detail.checked));
    }
  }

  done() {
    this.modalCtrl.dismiss();
  }

  reset() {
    if (this.flightType == 'animated-round-trip') {
      if (this.type == 'departure') {
        this.store.dispatch(
          [
            new SetDepStops(-1),
            new SetDepDeparture(24),
            new SetDepArrival(24),
            new SetDepPrice(0),
            new SetDepCorpFare(false),
            new ResetDepartureAirlines()
          ]);
      }
      else if (this.type == 'return') {
        this.store.dispatch(
          [
            new SetReStops(-1),
            new SetReDeparture(24),
            new SetReArrival(24),
            new SetRePrice(0),
            new SetReCorpFare(false),
            new ResetReturnAirlines()
          ]);
      }
    }
    else if (this.flightType !== 'animated-round-trip') {
      this.store.dispatch(
        [
          new SetReStops(-1),
          new SetReDeparture(24),
          new SetReArrival(24),
          new SetRePrice(0),
          new SetReCorpFare(false),
          new ResetFlightAirlines()
        ]);
    }
  }

}
