import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  fares: any[] = [
    { name: 'Base Fare', value: '1150' },
    { name: 'Service Charges', value: '1150' },
    { name: 'Other Charges', value: '1150' },
    { name: 'SGST(9%)', value: '1150' },
    { name: 'CGST(9%)', value: '1150' },
    { name: 'IGST(18%)', value: '1150' },
    { name: 'Net Payable', value: '1150' }
  ];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  bookBus() {
    this.modalCtrl.dismiss(null, null, 'bus-payment');
  }

}
