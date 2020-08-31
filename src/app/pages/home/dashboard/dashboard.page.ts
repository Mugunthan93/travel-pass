import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

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

  
  notification() {
    
  }
  
  profile() {
    this.store.dispatch(new Navigate(['/', 'home', 'profile']));
  }
}
