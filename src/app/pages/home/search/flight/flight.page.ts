import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.page.html',
  styleUrls: ['./flight.page.scss'],
})
export class FlightPage implements OnInit {

  @ViewChild('flightWay',{static : true}) way : IonTabs;

  constructor() {
  }
  
  ngOnInit() {
    this.way.select('one-way');
  }

}
