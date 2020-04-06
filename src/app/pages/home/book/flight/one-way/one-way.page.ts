import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

export interface fare{
  name: string,
  amount:string
}

export interface summary{
  fares: fare[],
  title:string
}

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  bookHeight: string = "45px";
  summaries: summary[] = [
    {
      fares: [
        { name: "Base Fare", amount: "2000" },
        { name: "Taxes", amount: "2000" },
        { name: "Markup", amount: "2000" }

    ], title: "Fare Summary" },
    {
      fares: [
        { name: "Base Fare", amount: "2000" },
        { name: "Taxes", amount: "2000" },
        { name: "K3", amount: "2000" },
        { name: "Extra Meals", amount: "2000" },
        { name: "Extra Baggage", amount: "2000" },
        { name: "SGST", amount: "2000" },
        { name: "CGST", amount: "2000" },
        { name: "IGST", amount: "2000" }
    ], title: "Total Summary" }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
