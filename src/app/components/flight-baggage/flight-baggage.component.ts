import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-flight-baggage',
  templateUrl: './flight-baggage.component.html',
  styleUrls: ['./flight-baggage.component.scss'],
})
export class FlightBaggageComponent implements OnInit {

  @Input() list : any;

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    console.log(this.list);
  }

  closeBaggage() {
    this.modalCtrl.dismiss();
  }

}
