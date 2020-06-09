import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { flightResult } from 'src/app/models/search/flight';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.scss'],
})
export class TripFilterComponent implements OnInit {

  @Input() list: flightResult[];
  @Input() lisType : string;

  airlines : string[] = [
    'spiceJet',
    'airIndia',
    'lufthansa',
    'indigo',
    'spiceJet',
    'airIndia',
    'lufthansa',
    'indigo',
    'spiceJet',
    'airIndia',
    'lufthansa',
    'indigo'
  ];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  close() {
    this.modalCtrl.dismiss(this.list,this.lisType);
  }

  reset() {
    
  }

  chooseStop(evt){

  }

}
