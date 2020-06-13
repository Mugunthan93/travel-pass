import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'app-hotel-filter',
  templateUrl: './hotel-filter.component.html',
  styleUrls: ['./hotel-filter.component.scss'],
})
export class HotelFilterComponent implements OnInit {

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

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  chipSelection(property: any, index: number) {
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



}
