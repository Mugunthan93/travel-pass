import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingState, DownloadTicket } from 'src/app/stores/booking.state';
import { Observable } from 'rxjs';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';

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
    private fileOpener: FileOpener,
    public alertCtrl : AlertController
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

  async viewFile(pnr: string) {
    try {
      console.log(this.file.externalRootDirectory + '/TravellersPass/Ticket/' + pnr + ".pdf");
      await this.fileOpener.open(this.file.externalRootDirectory + '/TravellersPass/Ticket/' + pnr + ".pdf", 'application/pdf');
    }
    catch (error) {
      if (error.status == 9) {
        const failedAlert = await this.alertCtrl.create({
          header: 'File Error',
          subHeader: 'File Not Found',
          buttons: [
            {
              text: 'Retry',
              handler: () => {
                this.store.dispatch(new DownloadTicket(pnr));
              }
            }
          ]
        });
        failedAlert.present();
      }
    }
  }

  getPNR(pnr : string) : string[] {
    return JSON.parse(pnr);
  }

  downloadTicket(pnr : string) {
    this.store.dispatch(new DownloadTicket(pnr));
  }

}
