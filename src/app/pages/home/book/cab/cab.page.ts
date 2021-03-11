import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PassengerListComponent } from 'src/app/components/shared/passenger-list/passenger-list.component';
import { SearchState } from 'src/app/stores/search.state';
import { cabform, CabSearchState } from 'src/app/stores/search/cab.state';

@Component({
  selector: 'app-cab',
  templateUrl: './cab.page.html',
  styleUrls: ['./cab.page.scss'],
})
export class CabPage implements OnInit {

  cabForm$ : Observable<cabform>;
  searchType$: Observable<string>;
  travelType$: Observable<string>;
  tripType$: Observable<string>;

  constructor(
    public modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.cabForm$ = this.store.select(CabSearchState.getCabForm);
    this.searchType$ = this.store.select(SearchState.getSearchType);
    this.travelType$ = this.store.select(CabSearchState.getTravelType);
    this.tripType$ = this.store.select(CabSearchState.getTripType);
  }

  async addPassengerDetails() {
    const modal = await this.modalCtrl.create({
      component: PassengerListComponent,
      keyboardClose: false,
      id: 'passenger-info',
    });

    modal.onDidDismiss().then((resData) => {
      console.log(resData);
    });

    return await modal.present();
  }

  sendRequest() {

  }

}
