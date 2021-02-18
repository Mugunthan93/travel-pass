import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationComponent } from '../location/location.component';
import { Observable } from 'rxjs';
import { hotellist } from 'src/app/stores/result/hotel.state';
import { Store } from '@ngxs/store';
import { hotelFilter, HotelFilterState, SetStarRating, SetPlaces, SetHotelPrice, ResetPlaces } from 'src/app/stores/result/filter/hotel.filter.state';

@Component({
  selector: 'app-hotel-filter',
  templateUrl: './hotel-filter.component.html',
  styleUrls: ['./hotel-filter.component.scss'],
})
export class HotelFilterComponent implements OnInit {

  hotels: Observable<hotellist[]>;
  options = {
    budget: [
      { min: 0, max: 1500, selection: false },
      { min: 1500, max: 3000, selection: false },
      { min: 3000, max: 6000, selection: false },
      { min: 6000, max:10000, selection: false }
    ],
    property_type: [
      { name: 'Hotel', value: 40, selection: false },
      { name: 'Apartment', value: 40, selection: false},
      { name: 'Guest House', value: 40, selection: false},
      { name: 'HomeStay', value: 40, selection: false}
    ],
    amenities: [
      { name: 'Wi-Fi', value: 40, selection: false},
      { name: 'Room Service', value: 40, selection: false},
      { name: 'Parking', value: 40, selection: false},
      { name: 'Elevator/Lift', value: 40, selection: false}
    ],
    user_rating: [
      { rate: 3, value: 50, selection: false },
      { rate: 4, value: 50, selection: false },
      { rate: 5, value: 50, selection: false }
    ],
    location: []
  }
  budget = {
    selection: null
  }

  inputs$ : Observable<hotelFilter>;
  inputs: hotelFilter

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.inputs = this.store.selectSnapshot(HotelFilterState.getFilter);
    this.inputs$ = this.store.select(HotelFilterState.getFilter)
  }
  
  chipSelection(property: any) {
    console.log(property);
    property.selection = !property.selection;
  }

  async selectLocation() {
    const modal = await this.modalCtrl.create({
      component: LocationComponent,
      id:'location'
    });

    modal.onDidDismiss().then(
      (selectedLocation) => {
        console.log(selectedLocation);
      }
    );

    return await modal.present();
  }

  chooseStarRating(evt : CustomEvent) {
    this.store.dispatch(new SetStarRating(parseInt(evt.detail.value)));
  }

  priceRange(evt: CustomEvent) {
    this.store.dispatch(new SetHotelPrice(evt.detail.value));
  }

  choosePlaces(evt: CustomEvent) {
    this.store.dispatch(new SetPlaces(evt.detail.value, evt.detail.checked));
  }

  reset() {
    this.store.dispatch(
      [
        new SetStarRating(-1),
        new SetHotelPrice(0),
        new ResetPlaces()
      ]);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null,'hotel-filter');
  }



}
