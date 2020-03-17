import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigation } from 'swiper/js/swiper.esm';
import { Navigate } from '@ngxs/router-plugin';
import { Login, Logout } from 'src/app/stores/app.state';

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

  openMenu() {
    this.menuCtrl.open();
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

  notification() {

  }

  profile() {

  }

}
