import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SeatSelectComponent } from 'src/app/components/bus/seat-select/seat-select.component';
import { modalController } from '@ionic/core';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  result: any[];

  constructor(
    public router: Router,
    public modalCtrl : ModalController,
    public activatedRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    this.result = [1,2,3,4,5,6,7];
  }

  async selectBus() {
    const modal = await this.modalCtrl.create({
      component: SeatSelectComponent,
      id : 'seat-select'
    });
    
    return await modal.present();
    
  }
}
