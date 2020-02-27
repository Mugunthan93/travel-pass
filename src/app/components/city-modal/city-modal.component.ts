import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { City } from 'src/app/models/search';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent implements OnInit, OnDestroy {

  @Input() location: City;
  @Input() point: string;

  citySub: Subscription;
  cities: City[] = [];

  constructor(
    public authService: AuthService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.location);
  }

  selectCity(city: City) {
    this.modalCtrl.dismiss(city, this.point);
  }

  searchCity(cityString: string) {
    let currentCityString = cityString;
    this.cities = [];
    this.citySub = this.authService.searchCity(currentCityString).subscribe(
      (resData) => {
        console.log(resData);
        if (this.cities.length > 0) {
          this.cities = [];
        }
        this.cities = resData.data;
        console.log(this.cities);
      }
    );
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
