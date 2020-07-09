import { Component, OnInit, Input } from '@angular/core';
import { flightData } from 'src/app/models/search/flight';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss'],
})
export class FlightDetailsComponent implements OnInit {

  @Input() connecting: flightData[][];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  closeFlightDetail() {
    this.modalCtrl.dismiss();
  }

}
