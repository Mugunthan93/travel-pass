import { Component, OnInit } from '@angular/core';
import { resultObj, sortButton } from 'src/app/stores/result/flight.state';
import { Observable, Subscription } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { InternationalResultState, DepartureSort, ArrivalSort, DurationSort, PriceSort, SelectedFlight } from 'src/app/stores/result/flight/international.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/international.state';

@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];

  constructor(
    private store: Store,
    public modalCtrl: ModalController
  ) { }

  selectedFlight: any = null;

  flightList: resultObj[];
  flightList$: Observable<resultObj[]>;
  flightListSub: Subscription;

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  mailStatus$: Observable<boolean>;

  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (result: string) => {
        this.resultType = result;
        console.log(this.resultType);
      }
    );

    this.flightList$ = this.store.select(InternationalResultState.getInternationalRoundTrip);
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
      (filteredData) => {
        console.log(filteredData);
        // this.flightList = filteredData.data;
      }
    );

    return await modal.present();
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

  currentFlight(result: resultObj) {
    this.selectedFlight = result;
    this.store.dispatch(new SelectedFlight(result));
  }

  changeStatus(status: Observable<boolean>) {
    this.mailStatus$ = status;
    this.mailStatus$.subscribe(status => console.log(status));
  }

  back() {

  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
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
