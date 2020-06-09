import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Router } from '@angular/router';
import { flightResult } from 'src/app/models/search/flight';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit,OnDestroy {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];
  selectedFlight: any = null;

  flightList: any[];
  flightList$: Observable<any[]>;
  flightListSub: Subscription;

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store:Store
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

    this.flightList$ = this.store.select(FlightResultState.getOneWay);
    this.flightListSub = this.flightList$.subscribe(
      (res: any[]) => {
        console.log(res);
        this.flightList = res;
      }
    );
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        list: this.flightList
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
    this.router.navigate(['/','home','book','flight','one-way']);
  }

  currentFlight(flight){
    this.selectedFlight = flight;
  }

  ngOnDestroy() {
    if(this.flightListSub){
      this.flightListSub.unsubscribe();
    }
    if (this.resultTypeSub) {
      this.resultTypeSub.unsubscribe();
    }
  }
}
