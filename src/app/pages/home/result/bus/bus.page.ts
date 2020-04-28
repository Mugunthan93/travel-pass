import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusFilterComponent } from 'src/app/components/bus/bus-filter/bus-filter.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  result: any[];

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute : ActivatedRoute
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

  selectBus() {
    this.router.navigate(['./select-seat'], {relativeTo:this.activatedRoute});
  }

}
