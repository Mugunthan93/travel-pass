import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Navigation } from 'swiper/js/swiper.esm';
import { Navigate } from '@ngxs/router-plugin';
import { Login, Logout } from 'src/app/stores/auth.state';
import { MyBooking } from 'src/app/stores/booking.state';
import { ApprovalRequest } from 'src/app/stores/approval.state';

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
    
  }
}
