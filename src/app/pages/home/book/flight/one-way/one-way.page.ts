import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerInfoComponent } from 'src/app/components/flight/passenger-info/passenger-info.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { resultObj } from 'src/app/stores/result/flight.state';
import { FLightBookState, bookObj } from 'src/app/stores/book/flight.state';
import { FlightSearchState } from 'src/app/stores/search/flight.state';
import { OneWaySearchState } from 'src/app/stores/search/flight/oneway.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {
  
  flightDetail: Observable<bookObj>;
  adult: string;
  child: string;
  infant: string;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {

    this.adult = this.store.selectSnapshot(state => state.OneWaySearchState.getAdult);
    this.child = this.store.selectSnapshot(state => state.OneWaySearchState.getChild);
    this.infant = this.store.selectSnapshot(state => state.OneWaySearchState.getInfant);

    this.flightDetail = this.store.select(FLightBookState.getFlightDetail);
    this.flightDetail.subscribe(flight => console.log(flight));
  }

  FairValue(value : any) {
    console.log(value);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerInfoComponent,
      id:'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  bookNow() {

  }

}
