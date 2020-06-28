import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MyBooking } from 'src/app/stores/booking.state';
import { ApprovalRequest } from 'src/app/stores/approval.state';
import { Logout } from 'src/app/stores/auth.state';
import { UserState } from 'src/app/stores/user.state';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent implements OnInit {

  isUser: Observable<boolean>;
  isManager: Observable<boolean>;

  constructor(
    private store: Store,
    public menuCtrl : MenuController
  ) { }

  ngOnInit() {
    this.isManager = this.store.select(UserState.isManager);
  }

  myBookings() {
    this.store.dispatch(new MyBooking('flight'));
  }

  approvalRequest() {
    this.store.dispatch(new ApprovalRequest('flight'));
  }

  onLogout() {
    this.store.dispatch(new Logout())
  }

}
