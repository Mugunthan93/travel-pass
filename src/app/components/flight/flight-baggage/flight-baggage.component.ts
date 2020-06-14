import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { flightData } from 'src/app/models/search/flight';

@Component({
  selector: 'app-flight-baggage',
  templateUrl: './flight-baggage.component.html',
  styleUrls: ['./flight-baggage.component.scss'],
})
export class FlightBaggageComponent implements OnInit {

  @Input() baggage: flightData[][];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    console.log(this.baggage);
  }

  closeBaggage() {
    this.modalCtrl.dismiss();
  }

}
