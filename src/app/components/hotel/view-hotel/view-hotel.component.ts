import { Component, OnInit, SecurityContext } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AboutHotelComponent } from '../about-hotel/about-hotel.component';
import { HotelLocationComponent } from '../hotel-location/hotel-location.component';
import { ViewRoomComponent } from '../view-room/view-room.component';
import { Store } from '@ngxs/store';
import { HotelResultState, selectedHotel } from 'src/app/stores/result/hotel.state';
import { Observable } from 'rxjs';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import * as decode from 'decode-html';
import { DomSanitizer } from '@angular/platform-browser';
import { HotelSearchState, hotelForm } from 'src/app/stores/search/hotel.state';
import * as _ from 'lodash';

export interface imageTiles {
  cols: number,
  rows: number,
  img?: string
}

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss'],
})
export class ViewHotelComponent implements OnInit {

  hotel$: Observable<selectedHotel>;
  imgList$: Observable<imageTiles[]>;
  
  hotelSearch$: Observable<hotelForm>;
  totalGuest$: Observable<number>;
  totalHotels$: Observable<number>;

  constructor(
    private store : Store,
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public domSantizier: DomSanitizer,
    private webView : WebView
  ) { }

  ngOnInit() {
    this.hotel$ = this.store.select(HotelResultState.getSelectedHotel);
    
    this.hotelSearch$ = this.store.select(HotelSearchState.getSearchData);
    this.totalGuest$ = this.store.select(HotelSearchState.getGuest);
    this.totalHotels$ = this.store.select(HotelResultState.totalResult);
  }

  imgTile(img: string[]): imageTiles[] {

    let defaultTile: imageTiles[] = [
      { rows: 3, cols: 1, img: null },
      { rows: 1, cols: 1, img: null },
      { rows: 1, cols: 1, img: null },
      { rows: 1, cols: 1, img: null },
      { rows: 1, cols: 1, img: null },
      { rows: 1, cols: 1, img: null },
      { rows: 1, cols: 1, img: null }
    ]

    //default tiles
    let currentTile = img.map(
      (el,ind) => {
        if (ind == 0) {
          return {
            rows: 3,
            cols: 1,
            img: this.webView.convertFileSrc(el)
          }
        }
        else if (ind >= 1) {
          if (ind !== 6) {
            return {
              rows: 1,
              cols: 1,
              img: this.webView.convertFileSrc(el)
            }
          }
          else if (ind == 6) {
            return {
              rows: 1,
              cols: 1,
              img: this.webView.convertFileSrc(el)
            }
          }
        }
      }
    );

    let mergedTile = _.merge(defaultTile,currentTile);
    return mergedTile.slice(0,7);
  }

  decodeDescritption(desc: string) {
    const descTemplate = decode(desc);
    const sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, descTemplate);
    return sanitizedTemplate;
  }

  async showAll() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'about-hotel'
      }
    });

    return await modal.present();
  }

  async readMore() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'about-hotel'
      }
    });

    return await modal.present();
  }

  async viewLocation() {
    const modal = await this.modalCtrl.create({
      component: HotelLocationComponent
    });
    return await modal.present();
  }

  async selectRoom() {
    const modal = await this.modalCtrl.create({
      component: ViewRoomComponent,
      id : 'view-room'
    });
    return await modal.present();
  }

  async back() {
    await this.modalCtrl.dismiss(null, null,'view-hotel');
  }

}
