import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ApprovalState, HandleRequest } from 'src/app/stores/approval.state';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.scss'],
})
export class ApproveRequestComponent implements OnInit {

  Detail$ : Observable<any>;
  type : string;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.Detail$ = this.store.select(ApprovalState.getSelectedRequest);
    this.type = this.store.selectSnapshot(ApprovalState.getType);
  }
  
  approveRequest() {
    this.store.dispatch(new HandleRequest('open'));
  }

  declineRequest() {
    this.store.dispatch(new HandleRequest('rej'));
  }

  duration(duration : number) {
    return moment.duration(duration, 'minutes').days() + "d " + moment.duration(duration, 'minutes').hours() + "h " + moment.duration(duration, 'minutes').minutes() + "m"
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  passenger() : Observable<any[]> {
    return this.Detail$
      .pipe(
        map(
          (detail) => {
            switch(this.type){
              case 'flight' : return detail.passenger_details.passenger;
              case 'hotel' : return detail.guest_details.passengers;
              case 'bus' : return detail.passenger_details.blockSeatPaxDetails;
            }
          }
        )
      );
  }

  passengerTitle(passenger : any,i : number) {
    switch(this.type) {
      case 'flight' : passenger.IsLeadPax ? 'Lead Passenger' : 'Passenger ' + i;
      case 'hotel' : passenger.LeadPassenger ? 'Lead Passenger' : 'Passenger ' + i
    }
  }

}
