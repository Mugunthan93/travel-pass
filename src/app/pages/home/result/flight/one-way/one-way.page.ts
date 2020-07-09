import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { resultObj } from 'src/app/stores/result/flight.state';
import { OneWayResultState, SelectedFlight } from 'src/app/stores/result/flight/oneway.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/oneway.state';

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
