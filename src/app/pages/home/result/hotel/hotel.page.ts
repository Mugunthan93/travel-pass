import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { hotellist, HotelResultState, ViewHotel, AddHotels } from 'src/app/stores/result/hotel.state';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';
import { ViewHotelComponent } from 'src/app/components/hotel/view-hotel/view-hotel.component';
import { sortButton, SortState } from 'src/app/stores/result/sort.state';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  @ViewChild('infinite', { static: true }) infinite: IonInfiniteScroll;

  hotelList$: Observable<hotellist[]>;
  limit$: Observable<number>;
  isLoading: boolean = false;
  loading: string = "Loading Hotels";

  sortBy$: Observable<sortButton>;

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private store: Store,
    private webview : WebView
  ) { }
  
  ngOnInit() {
    this.hotelList$ = this.store.select(HotelResultState.getHotelList);
    this.limit$ = this.store.select(HotelResultState.getLimit);
    this.sortBy$ = this.store.select(SortState.getHotelSortBy);
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

  async viewHotel(hotel: hotellist) {

    const modal = await this.modalCtrl.create({
      component: ViewHotelComponent,
      id: 'view-hotel'
    })

    this.store.dispatch(new ViewHotel(hotel))
      .subscribe({
        complete: async () => {
          await modal.present();
        }
      });
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
      .subscribe(
        async (res) => {
          if (res.scroll == 'finished') {
            await this.infinite.complete();
          }
          else if(res.scroll == "stopped") {
            this.loading = "No more Hotels";
            await this.infinite.complete();
          }
        }
      );
  }

  loadImg(hotel: hotellist) {
    if (hotel.Images) {
      return hotel.Images[0];
      // return this.webview.convertFileSrc(hotel.Images[0]);
    }
    else {
      return hotel.HotelPicture;
    }
  }

  
}
