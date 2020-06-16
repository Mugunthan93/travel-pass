import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { flightResult } from 'src/app/models/search/flight';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];
  selectedFlight: any = null;
  
  flightList: resultObj[];
  flightList$: Observable<resultObj[]>;
  flightListSub: Subscription;


  resultType$: Observable<string>;
  resultTypeSub: Subscription;
  resultType: string;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store: Store
  ) {
  }
  
  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (result: string) => {
        this.resultType = result;
        console.log(this.resultType);
      }
    );

    this.flightList$ = this.store.select(FlightResultState.getMultiWay);
    this.flightListSub = this.flightList$.subscribe(
      (res: resultObj[]) => {
        console.log(res);
        this.flightList = res;
      }
    );
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        type: this.resultType
      }
    });

    modal.onDidDismiss().then(
      (filteredFlightList) => {
        this.flightList = filteredFlightList.data;
      }
    );

    return await modal.present();
  }

  book() {
    this.router.navigate(['/','home','book','flight','multi-city']);
  }

  currentFlight(flight){
    this.selectedFlight = flight;
  }

  ngOnDestroy() {
    if (this.flightListSub) {
      this.flightListSub.unsubscribe();
    }
  }

  back() {

  }

}
