import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  fares: any[] = [
    { name: 'Base Fare', value: '1150' },
    { name: 'Service Charges', value: '1150' },
    { name: 'Other Charges', value: '1150' },
    { name: 'SGST(9%)', value: '1150' },
    { name: 'CGST(9%)', value: '1150' },
    { name: 'IGST(18%)', value: '1150' },
    { name: 'Net Payable', value: '1150' }
  ];

  constructor() { }

  ngOnInit() {
  }

  bookBus() {
    
  }

}
