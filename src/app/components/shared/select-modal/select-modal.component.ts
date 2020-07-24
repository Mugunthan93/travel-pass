import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { city, hotelcity, SharedState, GetFlightCity, GetHotelCity, GetNationality, nationality } from 'src/app/stores/shared.state';
import { Store } from '@ngxs/store';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SearchState } from 'src/app/stores/search.state';
import { StateReset } from 'ngxs-reset-plugin';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
})
export class SelectModalComponent implements OnInit {

  @Input() title: string;
  @ViewChild('city', { static: true, read: IonInput }) cityInput: IonInput;

  flightcities$: Observable<city[]>;
  hotelcities$: Observable<hotelcity[]>;
  nationalities$: Observable<nationality[]>;
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
    this.type = this.store.selectSnapshot(SearchState.getSearchMode);
    this.flightcities$ = this.store.select(SharedState.flightcities);
    this.hotelcities$ = this.store.select(SharedState.hotelcities);
    this.nationalities$ = this.store.select(SharedState.nationalities);
  }

  async select(selectedVal: any) {
    this.store.dispatch(new StateReset(SharedState));
    await this.modalCtrl.dismiss(selectedVal);
  }

  async search(searchString: string) {
    console.log(searchString);
    if (searchString.length >= 3) {
      if (this.title == 'city') {
        if (this.type == 'flight') {
          this.store.dispatch(new GetFlightCity(searchString));
        }
        else if (this.type == 'hotel') {
          this.store.dispatch(new GetHotelCity(searchString));
        }
      }
      else if (this.title == 'nationality') {
        this.store.dispatch(new GetNationality(searchString));
      }
      
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
    this.store.dispatch(new StateReset(SharedState));
  }

}
