import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripComponent } from 'src/app/components/expense/trip/trip.component';
import { Store } from '@ngxs/store';
import { GetProjectList } from 'src/app/stores/dashboard.state';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.page.html',
  styleUrls: ['./expense-tab.page.scss'],
})
export class ExpenseTabPage implements OnInit {

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  async addTrips() {
    const modal = await this.modalCtrl.create({
      component: TripComponent,
      id: 'trip'
    });
    this.store.dispatch(new GetProjectList(modal));
  }

}
