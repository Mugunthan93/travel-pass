import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassengerDetailComponent } from '../passenger-detail/passenger-detail.component';
import { Store } from '@ngxs/store';
import { OneWayBookState } from 'src/app/stores/book/flight/oneway.state';
import { FLightBookState, passenger, SelectPassenger, DeselectPassenger } from 'src/app/stores/book/flight.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.scss'],
})
export class PassengerInfoComponent implements OnInit {

  passengers$: Observable<passenger[]>;
  selectedPassengers$: Observable<passenger[]>;
  selected$: Observable<number>;
  count$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.passengers$ = this.store.select(FLightBookState.getPassengers);
    this.selectedPassengers$ = this.store.select(FLightBookState.getSelectedPassengers);
    this.selected$ = this.store.select(FLightBookState.getSelected);
    this.count$ = this.store.select(FLightBookState.getCount);
    
  }
  
  async getDetail() {
      const modal = await this.modalCtrl.create({
        component: PassengerDetailComponent,
        componentProps: {
          form: 'add',
          pax: null
        },
        id: 'passenger-details'
      });

      return await modal.present();
  }

  async editPassenger(pax: passenger) {
    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'edit',
        pax : pax
      },
      id: 'passenger-details'
    });

    return await modal.present();
  }

  getPass(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeselectPassenger(evt.detail.value));
    }
  }

  gender(pax: passenger): string {
    if (pax.Gender == null) {
      switch (pax.Title) {
        case 'Mr': return 'Male';
        case 'Mstr': return 'Male';
        case 'Ms': return 'Female';
        case 'Mrs': return 'Female';
      }
    }
    switch (pax.Gender) {
      case 1: return 'Male';
      case 2: return 'Female';
    }
  }

  dismissInfo() {
    this.modalCtrl.dismiss(null, null,'passenger-info');
  }

}
