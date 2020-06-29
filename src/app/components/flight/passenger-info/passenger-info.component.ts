import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerDetailComponent } from '../passenger-detail/passenger-detail.component';
import { Store } from '@ngxs/store';
import { OneWayBookState } from 'src/app/stores/book/flight/oneway.state';
import { FLightBookState, passenger } from 'src/app/stores/book/flight.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.scss'],
})
export class PassengerInfoComponent implements OnInit {

  passengers$: Observable<passenger[]>;
  selected$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.passengers$ = this.store.select(FLightBookState.getPassengers);
    this.selected$ = this.store.select(FLightBookState.getSelected);
    
  }
  
  async getDetail() {
      const modal = await this.modalCtrl.create({
        component: PassengerDetailComponent,
        id: 'passenger-details'
      });

      modal.onDidDismiss().then(
        (resData) => {
          console.log(resData);
        }
      );

      return await modal.present();
  }

  dismissInfo() {
    this.modalCtrl.dismiss(null, null,'passenger-info');
  }

}
