import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj, sortButton, ResetEmailDetail } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { DepartureSort, ArrivalSort, DurationSort, PriceSort, OneWayResultState, SelectedFlight } from 'src/app/stores/result/flight/oneway.state';
import { OneWaySendRequest, GetFareQuoteSSR } from 'src/app/stores/book/flight/oneway.state';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit,OnDestroy {

  selectedFlight: Observable<resultObj>;

  flightList: resultObj[];
  flightList$: Observable<resultObj[]>;
  flightListSub: Subscription;

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  mailStatus$: Observable<boolean>;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store:Store
  ) {
  }
  
  ngOnInit() {

    this.store.dispatch(new ResetEmailDetail());
    this.selectedFlight = this.store.select(OneWayResultState.getSelectedFlight);

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (type: string) => {
        this.resultType = type;
      }
    );

    this.flightList$ = this.store.select(OneWayResultState.getOneWay);
    this.flightListSub = this.flightList$.subscribe(
      (res: resultObj[]) => {
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

    return modal.present();
  }

  changeStatus(status : Observable<boolean>) {
    this.mailStatus$ = status;
    this.mailStatus$.subscribe(status => console.log(status));
  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }

  currentFlight(flight : resultObj) {
    this.store.dispatch(new SelectedFlight(flight));
  }

  ngOnDestroy() {
    if(this.flightListSub){
      this.flightListSub.unsubscribe();
    }
    if (this.resultTypeSub) {
      this.resultTypeSub.unsubscribe();
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

  getSort(item : sortButton) {
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
