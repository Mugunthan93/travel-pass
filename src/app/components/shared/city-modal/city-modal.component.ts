import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController, IonInput } from '@ionic/angular';
import { city, SharedState, GetFlightCity, hotelcity, GetHotelCity } from 'src/app/stores/shared.state';
import { Store } from '@ngxs/store';
import { SearchState } from 'src/app/stores/search.state';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { StateReset } from 'ngxs-reset-plugin';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent implements OnInit {

  @ViewChild('city', { static: true, read: IonInput }) cityInput: IonInput;

  flightcities$: Observable<city[]>;
  hotelcities$: Observable<hotelcity[]>;
  type: string;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    private keyboard: Keyboard
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.cityInput.setFocus();
      this.keyboard.show();
    }, 100);
  }

  ngOnInit() {
    this.type = this.store.selectSnapshot(SearchState.getSearchMode);
    this.flightcities$ = this.store.select(SharedState.flightcities);
    this.hotelcities$ = this.store.select(SharedState.hotelcities);
  }

  async selectCity(city: any) {
    this.store.dispatch(new StateReset(SharedState));
    await this.modalCtrl.dismiss(city);
  }

  searchCity(cityString: string) {
    console.log(cityString);
    if (cityString.length >= 3) {
      if (this.type == 'flight') {
        this.store.dispatch(new GetFlightCity(cityString));
      }
      else if (this.type == 'hotel') {
        this.store.dispatch(new GetHotelCity(cityString));
      }
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
    this.store.dispatch(new StateReset(SharedState));
  }

}
