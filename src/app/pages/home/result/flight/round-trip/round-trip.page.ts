import { Component, OnInit } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ResultState } from 'src/app/stores/result.state';
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

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    private store : Store
  ) {
  }
  
  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (type: string) => {
        this.resultType = type;
        console.log(this.resultType);
      }
    );

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
