import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { busFilter, BusFilterState, ResetBusType, SetBusArrival, SetBusDeparture, SetBusType } from 'src/app/stores/result/filter/bus.filter.state';

@Component({
  selector: 'app-bus-filter',
  templateUrl: './bus-filter.component.html',
  styleUrls: ['./bus-filter.component.scss'],
})
export class BusFilterComponent implements OnInit {

  inputs: busFilter;
  inputs$: Observable<busFilter>;


  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.inputs = this.store.selectSnapshot(BusFilterState.getBusFilter);
    this.inputs$ = this.store.select(BusFilterState.getBusFilter);
    
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  depRange(evt: CustomEvent) {
    this.store.dispatch(new SetBusDeparture(evt.detail.value));
  }

  reRange(evt: CustomEvent) {
    this.store.dispatch(new SetBusArrival(evt.detail.value));
  }

  chooseAirline(evt: CustomEvent) {
    this.store.dispatch(new SetBusType(evt.detail.value, evt.detail.checked));
  }

  done() {
    this.modalCtrl.dismiss();
  }

  reset() {
    this.store.dispatch(
      [
        new SetBusDeparture(24),
        new SetBusArrival(24),
        new ResetBusType()
      ]);
  }


}
