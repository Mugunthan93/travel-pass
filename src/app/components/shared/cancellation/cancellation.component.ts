import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { BookingState, CancelTicket, SetCancelType } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: "app-cancellation",
  templateUrl: "./cancellation.component.html",
  styleUrls: ["./cancellation.component.scss"],
})
export class CancellationComponent implements OnInit {

  cancellationForm: FormControl;
  type$: Observable<string>;
  type: string;
  ticket$: Observable<any>;
  ticket: any;
  cancelType : 'full' | 'partial';

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.ticket$ = this.store.select(BookingState.getCancelTicket);
    this.ticket = this.store.selectSnapshot(BookingState.getCancelTicket);
    this.type$ = this.store.select(BookingState.getType);
    this.type = this.store.selectSnapshot(BookingState.getType);
    this.cancelType = this.store.selectSnapshot(BookingState.getCancelType);

    this.cancellationForm = new FormControl(null,[Validators.required]);
  }

  tripType(index: number): Observable<string> {
    return this.store.select(BookingState.getCancelTicket).pipe(
      map((ticket) => {
        switch (ticket.trip_requests.JourneyType) {
          case 1:
            return "One-Way Trip Detail";
          case 2:
            return "Round-Trip Detail";
          case 3:
            return "Trip " + index + " Detail";
        }
      })
    );
  }

  passenger(): Observable<any[]> {
    return this.ticket$.pipe(
      map((detail) => {
        switch (this.type) {
          case "flight":
            return detail.passenger_details.passenger;
          case "hotel":
            return detail.guest_details.passengers;
          case "bus":
            return detail.passenger_details.blockSeatPaxDetails;
        }
      })
    );
  }

  passengerTitle(passenger: any, i: number) {
    console.log(passenger);
    switch (this.type) {
      case "flight":
        return passenger.IsLeadPax ? "Lead Passenger" : "Passenger " + i;
      case "hotel":
        return passenger.LeadPassenger ? "Lead Passenger" : "Passenger " + i;
    }
  }

  changeCancelType(evt : CustomEvent) {
    console.log(evt);
    this.store.dispatch(new SetCancelType(evt.detail.value));
  }

  cancelTicket() {
    if(this.cancellationForm.valid) {
      let remarks = this.cancellationForm.value;
      this.store.dispatch(new CancelTicket(remarks));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "cancellation-ticket");
  }
}
