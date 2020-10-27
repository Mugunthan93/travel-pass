import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { SetTheme } from 'src/app/stores/theme.stata';
import { GetTripList } from 'src/app/stores/expense.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  constructor(
    public menuCtrl : MenuController,
    public store : Store
  ) { }

  ngOnInit() {

  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  tabChange(evt : any) {
    console.log(evt);
    this.store.dispatch(new SetTheme(evt.tab));
    if(evt.tab == 'expense-tab') {
      this.store.dispatch(new GetTripList());
    }
  }

  
  notification() {
    
  }
  
  profile() {
    this.store.dispatch(new Navigate(['/', 'home', 'profile']));
  }
}
