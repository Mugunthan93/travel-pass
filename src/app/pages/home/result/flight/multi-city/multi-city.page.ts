import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { flightResult } from 'src/app/models/search/flight';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj, sortButton } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { MultiCityResultState, SelectedFlight, DepartureSort, ArrivalSort, DurationSort, PriceSort } from 'src/app/stores/result/flight/multi-city.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/multi-city.state';

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
  selectedFlight: Observable<resultObj>;
  
  flightList: resultObj[];
  flightList$: Observable<resultObj[]>;
  flightListSub: Subscription;


  resultType$: Observable<string>;
  resultTypeSub: Subscription;
  resultType: string;

  mailStatus$: Observable<boolean>;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store: Store
  ) {
  }
  
  ngOnInit() {
    this.selectedFlight = this.store.select(MultiCityResultState.getSelectedFlight);

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (result: string) => {
        this.resultType = result;
        console.log(this.resultType);
      }
    );

    this.flightList$ = this.store.select(MultiCityResultState.getMultiWay);
    this.flightListSub = this.flightList$.subscribe(
      (res: resultObj[]) => {
        console.log(res);
        this.flightList = res;
      }
    );
  }

  changeStatus(status: Observable<boolean>) {
    this.mailStatus$ = status;
    this.mailStatus$.subscribe(status => console.log(status));
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
    this.store.dispatch(new GetFareQuoteSSR());
  }

  currentFlight(flight : resultObj){
    this.store.dispatch(new SelectedFlight(flight));
  }

  ngOnDestroy() {
    if (this.flightListSub) {
      this.flightListSub.unsubscribe();
    }
  }

  back() {

  }

  async mailTicket() {
    const modal = await this.modalCtrl.create({
      component: EmailItineraryComponent,
      componentProps: {
        type: this.resultType
      }
    });

    // modal.onDidDismiss().then(
    //   (filteredFlightList) => {
    //     this.flightList = filteredFlightList.data;
    //   }
    // );

    return modal.present();
  }

  getSort(item: sortButton) {
    if (item.value == 'departure') {
      this.store.dispatch(new DepartureSort(item.state));
    }
    else if (item.value == 'arrival') {
      this.store.dispatch(new ArrivalSort(item.state));

    }
    else if (item.value == 'duration') {
      this.store.dispatch(new DurationSort(item.state));

    }
    else if (item.value == 'price') {
      this.store.dispatch(new PriceSort(item.state));
    }
  }

}
