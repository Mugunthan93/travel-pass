import { Component, OnInit, Input } from '@angular/core';
import { flightList } from 'src/app/pages/home/result/flight/one-way/one-way.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.scss'],
})
export class TripFilterComponent implements OnInit {

  @Input() list: flightList[];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  close() {
    this.modalCtrl.dismiss(this.list);
  }

}
