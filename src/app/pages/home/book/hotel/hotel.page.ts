import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { SpecialRequestComponent } from 'src/app/components/hotel/special-request/special-request.component';
import { PoliciesComponent } from 'src/app/components/hotel/policies/policies.component';
import { AddGuestComponent } from 'src/app/components/hotel/add-guest/add-guest.component';
import { TermsConditionsComponent } from 'src/app/components/hotel/terms-conditions/terms-conditions.component';
import { Store } from '@ngxs/store';
import { HotelBookState, blockedRoom, RoomDetails } from 'src/app/stores/book/hotel.state';
import { Observable } from 'rxjs';
import { HotelSearchState, hotelForm, roomguest } from 'src/app/stores/search/hotel.state';
import { hotelDetail } from 'src/app/stores/result/hotel.state';
import { map } from 'rxjs/operators';
import { user } from 'src/app/models/user';
import { UserState } from 'src/app/stores/user.state';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { CompanyState } from 'src/app/stores/company.state';
import { GST } from 'src/app/stores/book/flight/oneway.state';
import { BookConfirmationComponent } from 'src/app/components/shared/book-confirmation/book-confirmation.component';

export interface hotelfare {
  basic: number
  service: number
  other: number
  sgst: number
  cgst: number
  igst: number
  total : number
}

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

  rooms$: Observable<roomguest[]>;

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

    this.rooms$ = this.store.select(HotelSearchState.getRooms);


  }

  totalCost(): Observable<hotelfare> {
    return this.selectedRoom$
      .pipe(
        map(
          (rooms: hotelDetail[]) => {

            let fare: hotelfare = {
              basic: 0,
              service: this.serviceCharges(),
              other: 0,
              sgst: this.GST().sgst,
              cgst: this.GST().cgst,
              igst: this.GST().igst,
              total: 0
            };

            rooms.forEach(
              (rm) => {
                fare.basic += rm.Price.PublishedPrice;
              }
            );

            fare.total = fare.basic + fare.service + fare.other + fare.sgst + fare.cgst + fare.igst;

            return fare;
          }
        )
      )
  }



  async hotelRules() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'about-hotel',
      },
      id:'about-hotel'
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
      id:'hotel-policies'
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

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose: false,
      id: 'passenger-info'
    });

    modal.onDidDismiss().then(
      (resData) => {
        console.log(resData);
      }
    );

    return await modal.present();
  }

  totalGuest() : Observable<string> {
    return this.rooms$
      .pipe(
        map(
          (guest: roomguest[]) => {
            let rooms: number = guest.length;
            let adults: number = 0;
            let childrens: number = 0;
            guest.forEach(el => adults += el.NoOfAdults);
            guest.forEach(el => childrens += el.NoOfChild);
            return rooms + ' Rooms, ' + (adults + childrens) + ' Guest';
          }
        )
      )
  }

  panChange(evt : CustomEvent) {
    this.pan = evt.detail.value;
  }

  async sendRequest() {
    const modal = await this.modalCtrl.create({
      component: BookConfirmationComponent,
      id: 'book-confirm'
    });

    return await modal.present();
  }

  GST(): GST {
    if (this.store.selectSnapshot(CompanyState.getStateName) == 'TN') {
      return {
        cgst: (this.serviceCharges() * 9) / 100,
        sgst: (this.serviceCharges() * 9) / 100,
        igst: 0
      }
    }
    else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'TN') {
      return {
        cgst: 0,
        sgst: 0,
        igst: (this.serviceCharges() * 18) / 100
      }
    }
  }

  serviceCharges(): number {
    let serviceCharge: number = 0;
    serviceCharge = this.store.selectSnapshot(CompanyState.getHotelServiceCharge) * this.store.selectSnapshot(HotelSearchState.getGuest);
    return serviceCharge;
  }

}
