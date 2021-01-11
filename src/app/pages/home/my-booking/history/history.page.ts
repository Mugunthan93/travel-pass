import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState, DownloadTicket, ViewFile, GetRescheduleTicket, GetcancelTicket } from 'src/app/stores/booking.state';
import { combineLatest, Observable, of } from 'rxjs';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';
import { map, withLatestFrom } from 'rxjs/operators';
import { CancellationComponent } from 'src/app/components/shared/cancellation/cancellation.component';
import { RescheduleComponent } from 'src/app/components/shared/reschedule/reschedule.component';

@Component({
  selector: "app-history",
  templateUrl: "./history.page.html",
  styleUrls: ["./history.page.scss"],
})
export class HistoryPage implements OnInit {

  historyBookings: Observable<any[]>;
  type$: Observable<string>;
  loading$: Observable<boolean>;
  status$ : Observable<string>;

  constructor(
    private store: Store,
    private file: File,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.status$ = this.store.select(BookingState.getStatus);
    this.historyBookings = this.store.select(BookingState.getHistoryBooking)
      .pipe(
        withLatestFrom(this.status$),
        map(
          (booking) => {
            let arr = booking[0];
            let status = booking[1]; 
            return arr.filter(el => el.status == status);
          }
        )
      );

    this.type$ = this.store.select(BookingState.getType);
    this.loading$ = this.store.select(BookingState.getLoading);
  }

  tripType(booking: any): string {
    // console.log(booking);
    switch (booking.trip_requests.JourneyType) {
      case 1:
        return "One Way";
        break;
      case 2:
        return "Round Trip";
        break;
      case 3:
        return "Multi City";
        break;
      default:
        return "";
    }
  }

  originName(booking: any): Observable<string> {
    return combineLatest(of(booking), this.type$).pipe(
      map((booktype) => {
        let type = booktype[1];
        let booking = booktype[0];
        if (type == "flight") {
          return booking.trip_requests.Segments[0]
            ? booking.trip_requests.Segments[0].OriginName
            : "";
        } else if (type == "hotel") {
          return booking.guest_details.basiscInfo.CheckInDate;
        } else if (type == "bus") {
          return booking.bus_requests[0].sourceCity;
        } else if (type == "train") {
          return booking.train_requests.Segments[0].OriginName;
        }
      })
    );
  }

  DestinationName(booking: any): Observable<string> {
    return combineLatest(of(booking), this.type$).pipe(
      map((booktype) => {
        let type = booktype[1];
        let booking = booktype[0];
        if (type == "flight") {
          return booking.trip_requests.Segments[0]
            ? booking.trip_requests.Segments[0].DestinationName
            : "";
        } else if (type == "hotel") {
          return booking.guest_details.basiscInfo.CheckOutDate;
        } else if (type == "bus") {
          return booking.bus_requests[0].destinationCity;
        } else if (type == "train") {
          return booking.train_requests.Segments[0].DestinationName;
        }
      })
    );
  }

  updateDate(booking: any): string {
    return booking.updatedAt;
  }

  fare(booking: any): Observable<string> {
    return combineLatest(of(booking), this.type$).pipe(
      map((booktype) => {
        let type = booktype[1];
        let booking = booktype[0];
        if (type == "flight") {
          return booking.passenger_details.fare_response.published_fare;
        } else if (type == "hotel") {
          return booking.guest_details.basiscInfo.TotalBaseFare;
        } else if (type == "bus") {
          return booking.passenger_details.fareDetails.total_amount;
        } else if (type == "train") {
          return booking.passenger_details.basiscInfo.TotalBaseFare;
        }
      })
    );
  }

  viewFile(pnr: string[]) {
    this.store.dispatch(new ViewFile(pnr));
  }

  getPNR(booking: any): string[] {
    return JSON.parse(booking.passenger_details.PNR);
  }

  downloadTicket(pnr: string[]) {
    this.store.dispatch(new DownloadTicket(pnr));
  }

  rescheduleTicket(ticket : any) {
    this.store.dispatch(new GetRescheduleTicket(ticket,RescheduleComponent));
  }

  cancelTicket() {
    // this.store.dispatch(new GetcancelTicket(ticket,type,CancellationComponent));
  }
}
