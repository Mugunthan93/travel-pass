import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.page.html',
  styleUrls: ['./flight.page.scss'],
  providers : [IonTabs]
})
export class FlightPage implements OnInit {

  @ViewChild('tabs', { static: true, read: IonTabs })  tabs : IonTabs;

  constructor(
    public ionTabs : IonTabs
  ) {
  }
  
  ngOnInit() {
  }

}
