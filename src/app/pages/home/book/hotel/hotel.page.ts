import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { SpecialRequestComponent } from 'src/app/components/hotel/special-request/special-request.component';
import { PoliciesComponent } from 'src/app/components/hotel/policies/policies.component';
import { AddGuestComponent } from 'src/app/components/hotel/add-guest/add-guest.component';
import { TermsConditionsComponent } from 'src/app/components/hotel/terms-conditions/terms-conditions.component';
import { Store } from '@ngxs/store';
import { HotelBookState, blockedRoom, RoomDetails, AddLeadPan } from 'src/app/stores/book/hotel.state';
import { Observable } from 'rxjs';
import { HotelSearchState, hotelForm } from 'src/app/stores/search/hotel.state';
import { hotelDetail } from 'src/app/stores/result/hotel.state';
import { map } from 'rxjs/operators';
import { FareSummaryComponent } from 'src/app/components/hotel/fare-summary/fare-summary.component';
import { user } from 'src/app/models/user';
import { UserState } from 'src/app/stores/user.state';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  blockedRoom$: Observable<blockedRoom>;
  searchData$: Observable<hotelForm>;

  selectedRoom$: Observable<RoomDetails[]>;
  passenger$: Observable<user>; 

  pan: string = null;

  constructor(
    private store : Store,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {

    this.blockedRoom$ = this.store.select(HotelBookState.getBlockedRoom);
    this.searchData$ = this.store.select(HotelSearchState.getSearchData);

    this.selectedRoom$ = this.store.select(HotelBookState.getRoomDetail);
    this.passenger$ = this.store.select(UserState.user);

  }

  totalCost(): Observable<string> {
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

  async hotelRules() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'hotel-rules'
      }
    });

    return await modal.present();
  }

  async specialRequest() {
    const modal = await this.modalCtrl.create({
      component: SpecialRequestComponent,
    });

    return await modal.present();
  }

  async policies() {
    const modal = await this.modalCtrl.create({
      component: PoliciesComponent,
    });

    return await modal.present();
  }

  async terms_condition() {
    const modal = await this.modalCtrl.create({
      component: TermsConditionsComponent,
    });

    return await modal.present();
  }

  async addGuest() {
    const modal = await this.modalCtrl.create({
      component: AddGuestComponent,
      id: 'add-guest'
    });

    return await modal.present();
  }

  panChange(evt : CustomEvent) {
    this.pan = evt.detail.value;
  }

  async fare() {
    if (this.pan.length > 1) { 
      this.store.dispatch(new AddLeadPan(this.pan));
      const modal = await this.modalCtrl.create({
        component: FareSummaryComponent,
        id: 'fare-summary'
      });
  
      return await modal.present();
    }

  }

}
