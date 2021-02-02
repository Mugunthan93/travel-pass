import { Component, OnInit, ViewChild } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { hotellist, HotelResultState, ViewHotel, AddHotels, inventory } from 'src/app/stores/result/hotel.state';
import { Observable, from } from 'rxjs';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';
import { ViewHotelComponent } from 'src/app/components/hotel/view-hotel/view-hotel.component';
import { sortButton, SortState } from 'src/app/stores/result/sort.state';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { staticresponselist, hotelresultlist } from 'src/app/stores/search/hotel.state';
import { map, flatMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  @ViewChild('infinite', { static: true }) infinite: IonInfiniteScroll;
  skeletonHotel: number[] = [1,2,3,4,5,6,7,8];

  hotelList$: Observable<(staticresponselist & hotelresultlist)[]>;
  inventoryList$ : Observable<inventory[]>;
  limit$: Observable<number>;
  isLoading: boolean = false;
  loading: string = "Loading Hotels";
  sortBy$: Observable<sortButton>;
  loading$: Observable<number>;

  length: number;
  invsortBy$: Observable<sortButton>;

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private store: Store,
    private webview: WebView
  ) {

  }
  
  ngOnInit() {
    this.length = this.store.selectSnapshot(HotelResultState.getHotelLength);
    this.inventoryList$ = this.store.select(HotelResultState.getInventoryList);

    this.hotelList$ = this.store.select(HotelResultState.getHotelList);
    this.limit$ = this.store.select(HotelResultState.getLimit);
    this.sortBy$ = this.store.select(SortState.getHotelSortBy);
    this.invsortBy$ = this.store.select(SortState.getHotelSortBy);

    this.loading$ = this.store.select(HotelResultState.getLoading);

  }

  address(hotel: (staticresponselist & hotelresultlist)) {
    if(hotel.Address) {
      let address = hotel.Address.AddressLine.filter(el => !_.isObject(el));
      return address.map(el => _.startCase(el));
    }
    else {
      return [];
    }
  }

  viewHotel(hotel: hotellist) {
    const viewmodal$ = from(this.modalCtrl.create({
      component: ViewHotelComponent,
      id: 'view-hotel'
    }))
      .pipe(
        flatMap(
          (modalEl) => {
            return from(modalEl.present());
          }
        )
    );
    
    this.store.dispatch(new ViewHotel(hotel, viewmodal$))
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

  changeImg(evt : CustomEvent) {
    console.log(evt);
  }

  loadData(evt: any) {
    this.store.dispatch(new AddHotels())
      .subscribe({
        next: () => {
          return this.limit$
            .pipe(
              map(
                (limit : number) => {
                  evt.target.complete();
                  if (this.length < limit) {
                    evt.target.disabled = true;
                  }
                }
              )
            );
        }
      });
  }

  loadImg(hotel: (staticresponselist & hotelresultlist)): string {
    if(hotel.Images) {
      return hotel.Images[0];
      // return this.webview.convertFileSrc(hotel.Images[0]);
    }
    else {
      "../../../../../assets/img/hotel/no-image-icon-hotel.png";
    }
  }
  
}
