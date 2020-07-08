import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState, DownloadTicket } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  historyBookings: Observable<any[]>;

  constructor(
    private store: Store,
    private file: File,
    private fileOpener: FileOpener
  ) { }

  ngOnInit() {
    console.log(this.file);
    this.historyBookings = this.store.select(BookingState.getHistoryBooking);
  }

  tripType(book: any) {
    switch (book.trip_requests.JourneyType) {
      case 1: return 'One Way'; break;
      case 2: return 'Round Trip'; break;
      case 3: return 'Multi City'; break;
      default: return '';
    }
  }

  async isFileExist(pnr: string): Promise<boolean> {
    return await this.file.checkFile(this.file.externalDataDirectory, pnr + ".pdf");
  }

  async viewFile(pnr : string) {
    await this.fileOpener.open(this.file.externalDataDirectory + pnr + ".pdf", 'application/pdf');
  }

  getPNR(pnr : string) : string[] {
    return JSON.parse(pnr);
  }

  downloadTicket(pnr : string) {
    this.store.dispatch(new DownloadTicket(pnr));
  }

}
