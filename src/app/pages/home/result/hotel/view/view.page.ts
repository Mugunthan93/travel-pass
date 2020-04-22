import { Component, OnInit, ViewChild } from '@angular/core';
import { AboutHotelComponent } from 'src/app/components/hotel/about-hotel/about-hotel.component';
import { ModalController, IonContent } from '@ionic/angular';
import { HotelLocationComponent } from 'src/app/components/hotel/hotel-location/hotel-location.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {


  @ViewChild(IonContent, { static: true }) content: IonContent;

  tiles: any = [
    { cols: 1, rows: 3, img: "../../../../assets/img/hotel/hotel-1.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-2.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-3.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-4.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-5.jpeg" },
    { cols: 1, rows: 1, img: "../../../../assets/img/hotel/hotel-6.jpeg" },
    { cols: 1, rows: 1, color: '#3d9ed7' }
  ];

  rules: any[] = ["1", "2", "3", "4"];

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public activatedRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.content);
  }

  async showAll() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'hotel-rules'
      }
    });

    return await modal.present();
  }

  async readMore() {
    const modal = await this.modalCtrl.create({
      component: AboutHotelComponent,
      componentProps: {
        selectedSegement: 'about-hotel'
      }
    });

    return await modal.present();
  }

  async viewLocation() {
    const modal = await this.modalCtrl.create({
      component: HotelLocationComponent
    });
    return await modal.present();
  }

  async selectRoom() {
    this.router.navigate(['room'], {relativeTo:this.activatedRoute});
  }

  scrolling(evt) {
    console.log(evt);
  }

}
