import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  result: any[];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.result = [1,2,3,4,5,6,7];
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component : BusFilterComponent
    });

    return await modal.present();
  }

}
