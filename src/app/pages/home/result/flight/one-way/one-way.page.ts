import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, resultObj, ResetEmailDetail } from 'src/app/stores/result/flight.state';
import { ResultState } from 'src/app/stores/result.state';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';

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

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (type: string) => {
        this.resultType = type;
      }
    );

    this.flightList$ = this.store.select(FlightResultState.getOneWay);
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
}
