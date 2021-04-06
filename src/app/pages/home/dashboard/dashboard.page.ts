import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { SetTheme } from 'src/app/stores/theme.stata';
import { ExpenseState, GetTripList } from 'src/app/stores/expense.state';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AllUpcomingTrips } from 'src/app/stores/dashboard.state';
import { MyAllBooking } from 'src/app/stores/booking.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  currenttab : string = 'home-tab';

  start : moment.Moment;
  end : moment.Moment;

  startDate$ : Observable<moment.Moment>;
  endDate$ : Observable<moment.Moment>;

  constructor(
    public menuCtrl : MenuController,
    public modalCtrl : ModalController,
    public store : Store
  ) { }

  ngOnInit() {


    this.start = this.store.selectSnapshot(ExpenseState.getStartDate);
    this.end = this.store.selectSnapshot(ExpenseState.getEndDate);

    this.startDate$ = this.store.select(ExpenseState.getStartDate);
    this.endDate$ = this.store.select(ExpenseState.getEndDate);

  }

  async openMenu() {
    return await this.menuCtrl.open('first');
  }

  tabChange(evt : any) {
    console.log(evt);
    this.currenttab = evt.tab;

    if(evt.tab == 'home-tab') {
      this.store.dispatch([
        new SetTheme("home-tab"),
        new AllUpcomingTrips()
      ]);
    }
    else if(evt.tab == 'trip-tab'){
      this.store.dispatch([
        new SetTheme("home-tab"),
        new MyAllBooking()
      ]);
    }
    else if(evt.tab == 'expense-tab') {
      this.store.dispatch([
        new SetTheme(evt.tab),
        new GetTripList()
      ]);
    }
  }


  notification() {

  }

  profile() {
    this.store.dispatch(new Navigate(['/', 'home', 'profile']));
  }
}
