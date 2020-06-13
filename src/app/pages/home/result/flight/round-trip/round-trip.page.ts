import { Component, OnInit } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss']
})
export class RoundTripPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
  ) {
  }
  
  ngOnInit() {
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
    });

    modal.onDidDismiss().then(
      (filteredData) => {
        console.log(filteredData);
        // this.flightList = filteredData.data;
      }
    );

    return await modal.present();
  }

  book() {
    this.router.navigate(['/', 'home', 'book', 'flight', 'round-trip']);
  }
}
