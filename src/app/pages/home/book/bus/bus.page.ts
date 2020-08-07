import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PaymentComponent } from 'src/app/components/bus/payment/payment.component';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  constructor(
    public router: Router,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  async busPayment() {
    const modal = await this.modalCtrl.create({
      component: PaymentComponent,
      id : 'bus-payment'
    });

    return await modal.present();
  }

}
