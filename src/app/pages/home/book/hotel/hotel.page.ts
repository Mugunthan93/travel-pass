import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { SpecialRequestComponent } from 'src/app/components/hotel/special-request/special-request.component';
import { PoliciesComponent } from 'src/app/components/hotel/policies/policies.component';
import { AddGuestComponent } from 'src/app/components/hotel/add-guest/add-guest.component';
import { TermsConditionsComponent } from 'src/app/components/hotel/terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
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
    });

    return await modal.present();
  }

  fare() {
    this.router.navigate(['fare'],{relativeTo:this.activatedRoute});
  }

}
