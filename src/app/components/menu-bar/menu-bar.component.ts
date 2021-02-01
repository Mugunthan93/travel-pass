import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MyBooking } from 'src/app/stores/booking.state';
import { ApprovalRequest } from 'src/app/stores/approval.state';
import { Logout } from 'src/app/stores/auth.state';
import { UserState } from 'src/app/stores/user.state';
import { Observable } from 'rxjs';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { GetDashboard } from 'src/app/stores/dashboard.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent implements OnInit {

  isUser: Observable<boolean>;
  isManager: Observable<boolean>;
  name: Observable<string>;

  constructor(
    private store: Store,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.name = this.store.select(UserState.getFirstName);
    this.isManager = this.store.select(UserState.isManager);
  }

  async dashboard() {
    this.store.dispatch(new GetDashboard());
    return await this.menuCtrl.close('first');
  }

  async approvalRequest() {
    this.store.dispatch(new Navigate(['/','home','approval-request']));
    return await this.menuCtrl.close('first');
  }

  async onLogout() {
    let missing = await this.alertCtrl.create({
      header: 'Logout Alert',
      subHeader: 'Are you sure want to logout?',
      id: 'passenger-check',
      buttons: [
        {
          text: "Logout",
          handler: async () => {
            this.store.dispatch(new Logout())
              .subscribe({
                complete: async () => {
                  await missing.dismiss();
                }
              });
          }
        },
        {
          text: "Cancel",
          handler: async () => {
            await missing.dismiss();
          }
        }
      ]
    });
    await this.menuCtrl.toggle('first');
    return await missing.present();
  }

}
