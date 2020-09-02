import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, BehaviorSubject, from, combineLatest } from 'rxjs';
import { hotelForm, HotelSearchState } from 'src/app/stores/search/hotel.state';
import { Store } from '@ngxs/store';
import { HotelResultState, hotelDetail, selectedHotel, AddRoom, RemoveRoom, BlockRoom } from 'src/app/stores/result/hotel.state';
import { ModalController } from '@ionic/angular';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss'],
})
export class ViewRoomComponent implements OnInit {

  hotelSearch$: Observable<hotelForm>;
  totalGuest$: Observable<number>;
  totalHotels$: Observable<number>;

  category$: Observable<string[]>;

  selectedHotel$: Observable<selectedHotel>;
  roomDetail$: Observable<hotelDetail[]>;

  selectedCategory$ = new BehaviorSubject('all');
  selectedRoom$: Observable<hotelDetail[]>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public webView :WebView
  ) { }

  ngOnInit() {

    this.hotelSearch$ = this.store.select(HotelSearchState.getSearchData);
    this.totalGuest$ = this.store.select(HotelSearchState.getGuest);
    this.totalHotels$ = this.store.select(HotelResultState.totalResult);

    this.category$ = this.store.select(HotelResultState.getCategory); 

    this.selectedHotel$ = this.store.select(HotelResultState.getSelectedHotel);
    this.roomDetail$ = this.store.select(HotelResultState.getRoomDetail);

    this.selectedRoom$ = this.store.select(HotelResultState.getSelectedRoom);

  }

  bookHotel(room: hotelDetail) {
    console.log(room);
    this.store.dispatch(new AddRoom(room));
    this.store.dispatch(new BlockRoom());
  }

  categoryChange(evt: CustomEvent) {
    console.log(evt);
    this.selectedCategory$.next(evt.detail.value);
    this.selectedCategory$.subscribe(console.log);
  }

  getImage(img : string) : string {
    return this.webView.convertFileSrc(img);
  }

  removeRoom(room: hotelDetail) {
    this.store.dispatch(new RemoveRoom(room));
  }

  selectedRoom(room: hotelDetail): Observable<number> {
    let num: number = 0;
    return this.selectedRoom$
      .pipe(
        map(
          (rooms: hotelDetail[]) => {
            rooms.forEach(
              (rm) => {
                if (room.RoomIndex == rm.RoomIndex) {
                  num += 1;
                }
              }
            );
            return num;
          }
        )
      )
  }

  totalCost() : Observable<string> {
    return this.selectedRoom$
      .pipe(
        map(
          (rooms: hotelDetail[]) => {

            let cost: number = 0;

            rooms.forEach(
              (rm) => {
                cost += rm.Price.PublishedPrice;
              }
            );

            return cost.toString();
          }
        )
      )
  }

  back() {
    this.modalCtrl.dismiss(null, null,'view-room');
  }

}
