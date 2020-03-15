import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ModalController, NavParams } from '@ionic/angular';
import { City } from 'src/app/models/search';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent implements OnInit, OnDestroy {

  citySub: Subscription;
  cities: City[] = [];

  constructor(
    public authService: AuthService,
    public modalCtrl: ModalController,
    public navParams : NavParams
  ) {
    this.cities = [
      {airport_code: '',airport_name: '',city_code: 'MAS',city_name: 'Chennai',country_code: '',country_name: '',currency: '',nationalty: ''},
      {airport_code: '',airport_name: '',city_code: 'MAD',city_name: 'Madurai',country_code: '',country_name: '',currency: '',nationalty: ''},
      {airport_code: '',airport_name: '',city_code: 'CBE',city_name: 'Coimbatore',country_code: '',country_name: '',currency: '',nationalty: ''},
      {airport_code: '',airport_name: '',city_code: 'BAN',city_name: 'Bangalore',country_code: '',country_name: '',currency: '',nationalty: ''},
      {airport_code: '',airport_name: '',city_code: 'DEL',city_name: 'New Delhi',country_code: '',country_name: '',currency: '',nationalty: ''}
    ];
   }

  ngOnInit() {

  }

  selectCity(city: City) {
    this.modalCtrl.dismiss(city);
  }

  searchCity(cityString: string) {
    let currentCityString = cityString;
    this.cities = [];
    // this.citySub = this.authService.searchCity(currentCityString).subscribe(
    //   (resData) => {
    //     console.log(resData);
    //     if (this.cities.length > 0) {
    //       this.cities = [];
    //     }
    //     this.cities = resData.data;
    //     console.log(this.cities);
    //   }
    // );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.citySub) {
      this.citySub.unsubscribe();
    }
  }

}
