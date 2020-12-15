import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { SetTheme } from 'src/app/stores/theme.stata';
import { ChangeEndDate, ChangeStartDate, ExpenseState, GetProjectList, GetTripList } from 'src/app/stores/expense.state';
import * as moment from 'moment';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  startDate() {
    return this.startDate$.pipe(
      map(
        (date) => {
          return date.format('DD/MM/YYYY');
        }
      )
    );
  }

  endDate() {
    return this.endDate$.pipe(
      map(
        (date) => {
          return date.format('DD/MM/YYYY');
        }
      )
    );
  }

  async changeDate(field : string) {

    const options: CalendarModalOptions = {
      title: (field == 'start' ? 'To' : 'From') + ' Date',
      pickMode: 'single',
      color: ' #94A73E',
      cssClass: 'ion2-calendar',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: true,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this[field].toDate(),
      from: moment({}).subtract(1,'year').toDate(),
      to: new Date()
    }
    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: {
        options
      }
    });
    
    modal.present();

    const event: any = await modal.onDidDismiss();
    if (event.role == 'done') {
      if(field == 'start') {
        this.store.dispatch(new ChangeStartDate(moment(event.data.dateObj)));
        this.start = moment(event.data.dateObj);
      }
      else if(field == 'end') {
        this.store.dispatch(new ChangeEndDate(moment(event.data.dateObj)));
        this.end = moment(event.data.dateObj);
      }
    }
    else if (event.role == 'cancel') {
      return; 
    }

  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  tabChange(evt : any) {
    console.log(evt);
    this.currenttab = evt.tab;
    this.store.dispatch(new SetTheme(evt.tab));
    if(evt.tab == 'expense-tab') {
      this.store.dispatch([
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
