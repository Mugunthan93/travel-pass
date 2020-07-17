import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { resultObj, FlightResultState } from 'src/app/stores/result/flight.state';
import { map } from 'rxjs/operators';
import { InternationalResultState } from 'src/app/stores/result/flight/international.state';
import { MultiCityResultState } from 'src/app/stores/result/flight/multi-city.state';
import { ResultState } from 'src/app/stores/result.state';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selected-flight',
  templateUrl: './selected-flight.component.html',
  styleUrls: ['./selected-flight.component.scss'],
})
export class SelectedFlightComponent implements OnInit {

  selectedFlight$: Observable<resultObj>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.selectedFlight$ = this.store.select(ResultState.getResultType).pipe(
      map((type: string) => {
        if (type == 'round-trip') {
          return this.store.selectSnapshot(InternationalResultState.getSelectedFlight);
        }
        else if (type == 'multi-city') {
          return this.store.selectSnapshot(MultiCityResultState.getSelectedFlight);
        }
      })
    );

    this.selectedFlight$.subscribe(el => console.log(el));
  }

  dismiss() {
    this.modalCtrl.dismiss(false);
  }

  book() {
    this.modalCtrl.dismiss(true);
  }



}
