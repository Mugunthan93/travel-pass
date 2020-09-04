import { Component, OnInit } from '@angular/core';
import { flightFilter, FilterState, GetFilter } from 'src/app/stores/result/filter.state';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { ResultState } from 'src/app/stores/result.state';

@Component({
  selector: 'app-flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss'],
})
export class FlightFilterComponent implements OnInit {

  flightType: string;

  inputs: flightFilter;
  departure: flightFilter;
  return: flightFilter;


  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.flightType = this.store.selectSnapshot(ResultState.getResultType);
    
    this.inputs = this.store.selectSnapshot(FilterState.getFlightFilter);
    this.departure = this.store.selectSnapshot(FilterState.getDepartureFlightFilter);
    this.return = this.store.selectSnapshot(FilterState.getReturnFlightFilter);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  changeType(evt : CustomEvent) {
    this.inputs = evt.detail.value;
  }

  chooseStop(evt : CustomEvent) {
    this.inputs.stops = parseInt(evt.detail.value);
  }

  depRange(evt: CustomEvent) {
    this.inputs.depatureHours = evt.detail.value;
  }

  reRange(evt: CustomEvent) {
    this.inputs.arrivalHours = evt.detail.value;
  }

  priceRange(evt: CustomEvent) {
    this.inputs.price = evt.detail.value;
  }

  corpFare(evt: CustomEvent) {
    this.inputs.corporateFare = evt.detail.checked;
  }

  chooseAirline(evt: CustomEvent) {
    this.inputs.airlines.forEach(
      (el) => {
        if (_.isEqual(evt.detail.value,el)) {
          el.value = evt.detail.checked;
        }
      }
    );
  }

  done() {
    if (this.flightType == 'animated-round-trip') {
      this.store.dispatch([new GetFilter(this.departure,'departure'), new GetFilter(this.return,'return')]);
    }
    else if (this.flightType !== 'animated-round-trip'){
      this.store.dispatch(new GetFilter(this.inputs));
    }
  }

  reset() {
    let newairlines = this.inputs.airlines.map(
      (el) => {
        el.value = false;
        return el;
      }
    );

    this.inputs = {
      stops : -1,
      depatureHours : 24,
      arrivalHours : 24,
      price : 0,
      corporateFare: false,
      airlines: newairlines
    }

    if (this.flightType == 'animated-round-trip') {
      let newdepairlines = this.departure.airlines.map(
        (el) => {
          el.value = false;
          return el;
        }
      );

      this.departure = {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        price: 0,
        corporateFare: false,
        airlines: newdepairlines
      }

      let newreairlines = this.return.airlines.map(
        (el) => {
          el.value = false;
          return el;
        }
      );

      this.return = {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        price: 0,
        corporateFare: false,
        airlines: newreairlines
      }
    }
  }

}
