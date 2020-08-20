import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { blockedRoom, HotelBookState, RoomDetails } from 'src/app/stores/book/hotel.state';
import { hotelForm, HotelSearchState } from 'src/app/stores/search/hotel.state';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { BookConfirmationComponent } from '../../shared/book-confirmation/book-confirmation.component';

@Component({
  selector: 'app-fare-summary',
  templateUrl: './fare-summary.component.html',
  styleUrls: ['./fare-summary.component.scss'],
})
export class FareSummaryComponent implements OnInit {

  blockedRoom$: Observable<blockedRoom>;
  searchData$: Observable<hotelForm>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.blockedRoom$ = this.store.select(HotelBookState.getBlockedRoom);
    this.searchData$ = this.store.select(HotelSearchState.getSearchData);
  }

  baseFare() : Observable<number> {
    return this.blockedRoom$
      .pipe(
        map(
          (rooms: blockedRoom) => {

            let cost: number = 0;

            rooms.HotelRoomsDetails.forEach(
              (rm : RoomDetails) => {
                cost += rm.Price.PublishedPrice;
              }
            );

            return cost;
          }
        )
      )
  }

  async sendRequest() {
    const modal = await this.modalCtrl.create({
      component: BookConfirmationComponent,
      id : 'book-confirm'
    });

    return await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null,'fare-summary');
  }

}
