import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController, IonInput } from '@ionic/angular';
import { city, SharedState, ClearCity, GetFlightCity, hotelcity } from 'src/app/stores/shared.state';
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
  type$: Observable<string>;

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
    this.type$ = this.store.select(SearchState.getSearchMode);
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
      this.store.dispatch(new GetFlightCity(cityString));
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
    this.store.dispatch(new StateReset(SharedState));
  }

}
