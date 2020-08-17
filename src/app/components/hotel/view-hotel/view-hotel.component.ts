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

export interface imageTiles {
  cols: number,
  rows: number,
  img?: string,
  color? : string
}

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss'],
})
export class ViewHotelComponent implements OnInit {

  hotel$: Observable<selectedHotel>;
  imgList$: Observable<imageTiles[]>;

  rules: any[] = ["1", "2", "3", "4"];

  facilities$: Observable<number>;

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
    this.facilities$ = this.store.select(HotelResultState.getFacilities);
  }

  imgTile(img: string[]): imageTiles[] {

    let tile : imageTiles[] = img.map(
      (el : string, ind : number) => {
        let tiles: imageTiles = null;

        if (ind == 0) {
          tiles = {
            rows: 3,
            cols: 1,
            img: el,
            color: 'transparent'
          }
        }
        else if (ind >= 1) {
          if (ind !== 6) {
            tiles = {
              rows: 1,
              cols: 1,
              img: el,
              color: 'transparent'
            }
          }
          else if (ind == 6) {
            tiles = {
              rows: 1,
              cols: 1,
              img: el,
              color: '#e87474'
            }
          }
        }

        // if (ind == 0) {
        //   tiles = {
        //     rows: 3,
        //     cols: 1,
        //     img: this.webView.convertFileSrc(el),
        //     color: 'transparent'
        //   }
        // }
        // else if (ind >= 1) {
        //   if (ind !== 6) {
        //     tiles = {
        //       rows: 1,
        //       cols: 1,
        //       img: this.webView.convertFileSrc(el),
        //       color: 'transparent'
        //     }
        //   }
        //     else if (ind == 6) {
        //     tiles = {
        //       rows: 1,
        //       cols: 1,
        //       img: this.webView.convertFileSrc(el),
        //       color: '#e87474'
        //     }
        //   }
        // }

        return tiles;
      }
    );

    console.log(tile.slice(0, 7));
    return tile.slice(0,7);
  }

  decodeDescritption(desc: string) {
    const descTemplate = decode(desc);
    const sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, descTemplate);
    console.log(sanitizedTemplate);
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

  back() {
    this.modalCtrl.dismiss();
  }

}
