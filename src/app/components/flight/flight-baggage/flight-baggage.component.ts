import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { baggage } from 'src/app/stores/result/flight.state';

@Component({
  selector: 'app-flight-baggage',
  templateUrl: './flight-baggage.component.html',
  styleUrls: ['./flight-baggage.component.scss'],
})
export class FlightBaggageComponent implements OnInit {

  @Input() baggage: baggage[][];

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
