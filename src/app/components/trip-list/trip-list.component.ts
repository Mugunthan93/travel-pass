import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashboardState, upcomingTrips } from 'src/app/stores/dashboard.state';
import { DownloadTicket, GetcancelTicket, GetRescheduleTicket, ViewFile } from 'src/app/stores/booking.state';
import { RescheduleComponent } from '../shared/reschedule/reschedule.component';
import { File, FileError } from '@ionic-native/file/ngx';
import { catchError, first, flatMap, map } from 'rxjs/operators';
import { CancellationComponent } from '../shared/cancellation/cancellation.component';

export interface tripList {
  from : string
  to : string
  date : string
  time : string
}

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {

  upcomingTrips$: Observable<upcomingTrips[]>;
  loading$ : Observable<boolean>;

  rescheduled : string[] = ['flight'];
  cancelled : string[] = ['flight','hotel','bus','train'];

  constructor(
    private store : Store,
    private file : File
  ) {
   }

  ngOnInit() {
    this.upcomingTrips$ = this.store.select(DashboardState.getUpcomingTrips);
    this.loading$ = this.store.select(DashboardState.getLoading);
  }

  reschedule(id : number) {
    this.store.dispatch(new GetRescheduleTicket(id,RescheduleComponent));
  }

  download(pnr : string[]) {
    this.store.dispatch(new ViewFile(pnr));
  }

  cancel(id : number, type : string) {
    this.store.dispatch(new GetcancelTicket(id,type,CancellationComponent));
  }

  isView(ticket : string[]) : Observable<boolean> {
    return from(this.file.checkFile(this.file.externalRootDirectory +"/TravellersPass/Ticket/",ticket +".pdf"))
      .pipe(
        flatMap(
          (res : FileError | boolean) => {
            if((res as FileError).code == 1) {
              return this.store.dispatch(new DownloadTicket(ticket));
            }
            return of(res as boolean);
          }
        )
      );
  }

}
