import { Component, OnInit, ViewChild } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { hotellist, HotelResultState, AddHotelList } from 'src/app/stores/result/hotel.state';
import { Observable, from, of, iif } from 'rxjs';
import { Store, ofActionCompleted } from '@ngxs/store';
import { File } from '@ionic-native/file/ngx';
import * as _ from 'lodash';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  hotelList$: Observable<hotellist[]>;
  limit$: Observable<number>;
  isLoading: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private store: Store,
    private file: File
  ) { }

  ngOnInit() {
    this.hotelList$ = this.store.select(HotelResultState.getHotelList);
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
    console.log(evt);
  }

  imgURL(img: string[], code: string): Observable<string> {
    return of('');
    // return this.store.dispatch(new DownloadImage(img, code));
  }

  fileName(img : string[]) : string{
    let link = img[0].split('/');
    let fileName = link[link.length - 1];
    let name = fileName.substring(0, fileName.length - 5);
    return name;
  }

  loadData(evt: any) {
    this.store.dispatch(new AddHotelList(evt));
  }
  
}
