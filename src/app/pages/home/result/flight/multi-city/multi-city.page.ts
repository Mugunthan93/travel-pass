import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { resultObj } from 'src/app/stores/result/flight.state';
import { MultiCityResultState, SelectedFlight } from 'src/app/stores/result/flight/multi-city.state';
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
