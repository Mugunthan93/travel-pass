import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { Observable } from 'rxjs';
import { FlightResultState } from 'src/app/stores/result/flight.state';
import { Store } from '@ngxs/store';
import { ResultState } from 'src/app/stores/result.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  mailStatus$: Observable<boolean>;
  resultMode$: Observable<string>;
  resultType$: Observable<string>;

  resultMode: string;
  resultType: string;

  constructor(
    private store:Store,
    public modalCtrl : ModalController
  )
  {

  }

  ngOnInit() {
    this.resultMode$ = this.store.select(ResultState.getResultMode);
    this.resultType$ = this.store.select(ResultState.getResultType);

    this.resultMode = this.store.selectSnapshot(ResultState.getResultMode);
    this.resultType = this.store.selectSnapshot(ResultState.getResultType);

    this.mailStatus$ = this.store.select(FlightResultState.mailStatus);
  }

  back() {
    this.store.dispatch(new StateReset(ResultState));
    this.store.dispatch(new Navigate(['/', 'home', 'search', this.resultMode,this.resultType]));
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent
    });

    return modal.present();
  }

  async mailTicket() {
    const modal = await this.modalCtrl.create({
      component: EmailItineraryComponent,
      cssClass:'emailitinerary'
    });

    return modal.present();
  }

}
