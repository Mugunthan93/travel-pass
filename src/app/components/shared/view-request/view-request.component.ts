import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingState } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
})
export class ViewRequestComponent implements OnInit {

  Detail$: Observable<any>;
  type: string;

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.Detail$ = this.store.select(BookingState.getCurrentRequest);
    this.type = this.store.selectSnapshot(BookingState.getType);
  }

  passenger() : Observable<any[]> {
    return this.Detail$
      .pipe(
        map(
          (detail : any) => {
            switch(this.type){
              case 'flight' : return detail.passenger_details.passenger;
              case 'hotel' : return detail.guest_details.passengers;
              case 'bus' : return detail.passenger_details.blockSeatPaxDetails;
              case 'train' : return detail.passenger_details.passenger;
            }
          }
        )
      );
  }

  passengerTitle(passenger : any,i : number) {
    switch(this.type) {
      case 'flight' : passenger.IsLeadPax ? 'Lead Passenger' : 'Passenger ' + i;
      case 'hotel' : passenger.LeadPassenger ? 'Lead Passenger' : 'Passenger ' + i;
      case 'train' : passenger.primary ? 'Lead Passenger' : 'Passenger ' + i;
    }
  }


  async dismiss() {
    return await this.modalCtrl.dismiss(null,null,'view-req');
  }

  }
