import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { hotelForm, HotelSearchState } from 'src/app/stores/search/hotel.state';
import { Store } from '@ngxs/store';
import { HotelResultState, hotelDetail, selectedHotel, AddRoom, RemoveRoom, BlockRoom, ResetRoom } from 'src/app/stores/result/hotel.state';
import { ModalController, AlertController } from '@ionic/angular';
import * as decode from 'decode-html';
import { map } from 'rxjs/operators';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

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

  totalRoom: number;
  selectionAlert$: Observable<void>;

  openCombo$ : Observable<hotelDetail[][]>;
  fixedCombo$ : Observable<hotelDetail[][]>;

  isHTML = RegExp.prototype.test.bind(/^(<([^>]+)>)$/i);

  constructor(
    private store: Store,
    public modalCtrl : ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public webView: WebView,
    public alertCtrl : AlertController,
    public domSantizier: DomSanitizer
  ) { }

  ngOnInit() {

    this.hotelSearch$ = this.store.select(HotelSearchState.getSearchData);
    this.totalGuest$ = this.store.select(HotelSearchState.getGuest);
    this.totalHotels$ = this.store.select(HotelResultState.totalResult);

    this.category$ = this.store.select(HotelResultState.getCategory);

    this.selectedHotel$ = this.store.select(HotelResultState.getSelectedHotel);
    this.roomDetail$ = this.store.select(HotelResultState.getRoomDetail);

    this.selectedRoom$ = this.store.select(HotelResultState.getSelectedRoom);
    this.totalRoom = this.store.selectSnapshot(HotelSearchState.getTotalRooms);

    this.openCombo$ = this.store.select(HotelResultState.getOpenCombination);
    this.fixedCombo$ = this.store.select(HotelResultState.getFixedCombination);

  }

  getHotelImage(img : string) {
    return img;
    // return this.webView.convertFileSrc(img);
  }

  decodeDescritption(desc: string) {
    const descTemplate = decode(desc);
    const sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, descTemplate);
    return sanitizedTemplate;
  }

  bookHotel(room : hotelDetail[]) {
    room.forEach(rm => this.store.dispatch(new AddRoom(rm)));
  }

  confirmHotel() {
    this.store.dispatch(new BlockRoom());
  }

  categoryChange(evt: CustomEvent) {
    console.log(evt);
    this.selectedCategory$.next(evt.detail.value);
    this.selectedCategory$.subscribe(console.log);
  }

  addRoom(room: hotelDetail) {
    this.store.dispatch(new AddRoom(room));
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

  roomHeight() {
    return this.fixedCombo$.pipe(
      map(
        (combo) => {
          let length = (combo.length * 40) + 100;
          return length + 'px';
        }
      )
    );
  }

  back() {
    this.store.dispatch(new ResetRoom());
    this.modalCtrl.dismiss(null, null,'view-room');
  }

}
