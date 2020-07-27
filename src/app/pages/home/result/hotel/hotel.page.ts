import { Component, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ModalController } from '@ionic/angular';
import { HotelFilterComponent } from 'src/app/components/hotel/hotel-filter/hotel-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { hotellist, HotelResultState } from 'src/app/stores/result/hotel.state';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  hotelList$: Observable<hotellist[]>;

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private store : Store
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

}
