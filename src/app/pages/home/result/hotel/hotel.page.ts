import { Component, OnInit, ViewChild } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { hotellist, HotelResultState, hotelresponselist, DownloadResult, DownloadImage } from 'src/app/stores/result/hotel.state';
import { Observable, from, of, iif } from 'rxjs';
import { Store } from '@ngxs/store';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';
import { map, take, switchMap, mergeMap, tap, first, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  hotelList$: Observable<hotellist[]>;
  @ViewChild('infinite', { read: IonInfiniteScroll, static: true }) infinite: IonInfiniteScroll;

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private store: Store,
    private webview: WebView,
    private file: File
  ) { }

  ngOnInit() {
    this.hotelList$ = this.store.select(HotelResultState.getHotelList)
      .pipe(
        takeUntil(this.store.select(HotelResultState.getLimit))
      )
  }

  async hotelFilter() {
    const modal = await this.modalCtrl.create({
      component: HotelFilterComponent,
      id:'hotel-filter'
    });

    modal.onDidDismiss().then(
      (filterData) => {
        console.log(filterData);
      }
    );

    return await modal.present();
  }

  async viewHotel() {
    this.router.navigate(['view'], {relativeTo:this.activatedRoute});
  }

  sorting(evt : CustomEvent) {
    
  }

  starRating(rating: number): string[] {
    switch (rating) {
      case 5: return ['full', 'full', 'full', 'full', 'full'];
      case 4.5: return ['full', 'full', 'full', 'full', 'half'];
      case 4: return ['full', 'full', 'full', 'full'];
      case 3.5: return ['full', 'full', 'full', 'half'];
      case 3: return ['full', 'full', 'full'];
      case 2.5: return ['full', 'full', 'half'];
      case 2: return ['full', 'full'];
      case 1.5: return ['full', 'half'];
      case 1: return ['full'];
      case .5: return ['half'];
      case 0: return [];
      default: return [];
    }
  }

  imgError(evt : CustomEvent) {
    return evt;
  }

  imgURL(img: string[],code : string): Observable<string> {
    return from(img)
      .pipe(
        take(1),
        tap(el => this.store.dispatch(new DownloadImage(el, code))),
        tap(el => of(this.webview.convertFileSrc(el)))
      )
  }

  fileName(img : string[]) : string{
    let link = img[0].split('/');
    let fileName = link[link.length - 1];
    let name = fileName.substring(0, fileName.length - 5);
    return name;
  }

  loadData(evt : CustomEvent) {
    console.log(evt, this.infinite);
    
  }
  
}
