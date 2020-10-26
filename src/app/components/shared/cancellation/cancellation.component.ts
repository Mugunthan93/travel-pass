import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { BookingState } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: "app-cancellation",
  templateUrl: "./cancellation.component.html",
  styleUrls: ["./cancellation.component.scss"],
})
export class CancellationComponent implements OnInit {
  cancellationForm: FormGroup;
  type$: Observable<string>;
  type: string;
  ticket$: Observable<any>;
  ticket: any;

  constructor(private store: Store) {}

  ngOnInit() {
    this.ticket$ = this.store.select(BookingState.getCancelTicket);
    this.ticket = this.store.selectSnapshot(BookingState.getCancelTicket);
    this.type$ = this.store.select(BookingState.getType);
    this.type = this.store.selectSnapshot(BookingState.getType);
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

  submitCancellation() {}

  dismiss() {}
}
