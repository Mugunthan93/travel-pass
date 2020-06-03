import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { city, SharedState, GetCity, ClearCity } from 'src/app/stores/shared.state';
import { Store, ofActionDispatched, ofActionSuccessful, ofActionCanceled, ofActionErrored, ofActionCompleted, ofAction } from '@ngxs/store';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent implements OnInit, OnDestroy {

  citySub: Subscription;
  cities$: Observable<city[]>;
  cities: city[] = new Array(0);

  constructor(
    private store: Store,
    public modalCtrl: ModalController
  ) {
   }

  ngOnInit() {
    this.cities$ = this.store.select(SharedState.cities);
    this.citySub = this.cities$.subscribe(
      (resData: city[]) => {
        this.cities = [];
        this.cities = resData;
      }
    );
  }

  selectCity(city: any) {
    this.modalCtrl.dismiss(city);
  }

  searchCity(cityString: string) {
    console.log(cityString);
    if (cityString.length >= 3) {  
      this.store.dispatch(new GetCity(cityString));
    }
  }

  closeModal() {
    this.store.dispatch(new ClearCity());
    this.modalCtrl.dismiss(null);
  }

  ngOnDestroy() {
    if (this.citySub) {
      this.citySub.unsubscribe();
    }
  }

}
