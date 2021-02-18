import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput, ModalController, IonSearchbar } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { city, hotelcity, SharedState, GetFlightCity, GetHotelCity, GetNationality, nationality, buscity, GetBusCity, trainstation, GetTrainStation } from 'src/app/stores/shared.state';
import { Store } from '@ngxs/store';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SearchState } from 'src/app/stores/search.state';
import { StateReset } from 'ngxs-reset-plugin';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { map } from 'lodash';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
})
export class SelectModalComponent implements OnInit {

  @Input() title: string;
  @Input() category: string;
  @ViewChild('city', { static: true, read: IonSearchbar }) cityInput: IonSearchbar;

  flightcities$: Observable<city[]>;
  hotelcities$: Observable<hotelcity[]>;
  nationalities$: Observable<nationality[]>;
  buscities$: Observable<buscity[]>;
  trainStations$: Observable<trainstation[]>;

  type: string;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    private keyboard: Keyboard
  ) { }
  
  ionViewDidEnter() {
    setTimeout(() => {
      this.cityInput.setFocus();
      this.keyboard.show();
    }, 100);
  }

  ngOnInit() {
    console.log(this.category);
    this.type = this.store.selectSnapshot(SearchState.getSearchMode);

    this.flightcities$ = this.store.select(SharedState.flightcities);
    this.hotelcities$ = this.store.select(SharedState.hotelcities);
    this.nationalities$ = this.store.select(SharedState.nationalities);
    this.buscities$ = this.store.select(SharedState.buscities);
    this.trainStations$ = this.store.select(SharedState.getTrainStations);
  }

  async select(selectedVal: any) {
    this.store.dispatch(new StateReset(SharedState));
    await this.modalCtrl.dismiss(selectedVal);
  }

  search(searchString: string) {
    if (searchString.length > 2) {
      if (this.title == 'city') {
        if (this.type == 'flight') {
          return this.store.dispatch(new GetFlightCity(searchString));
        }
        else if (this.type == 'hotel') {
          return this.store.dispatch(new GetHotelCity(searchString));
        }
        else if (this.type == 'bus') {
          return this.store.dispatch(new GetBusCity(searchString));
        }
        else {
          return this.store.dispatch(new GetFlightCity(searchString));
        }

      }
      else if (this.title == 'nationality') {
        return this.store.dispatch(new GetNationality(searchString));
      }
      else if (this.title == 'Station') {
        if (this.category == 'domestic') {
          return this.store.dispatch(new GetTrainStation(searchString));
        }
        else if (this.category == 'international') {
          return this.store.dispatch(new GetFlightCity(searchString));
        }
      }
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
    this.store.dispatch(new StateReset(SharedState));
  }

}
