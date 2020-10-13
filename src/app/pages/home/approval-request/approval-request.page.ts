import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApprovalRequest, ApprovalState } from 'src/app/stores/approval.state';
import { MenuController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.page.html',
  styleUrls: ['./approval-request.page.scss'],
})
export class ApprovalRequestPage implements OnInit {

  constructor(
    private store: Store,
    public menuCtrl: MenuController,
    public loadingCtrl : LoadingController
  ) { }

  type$ : Observable<string>;

  ngOnInit() {
    this.type$ = this.store.select(ApprovalState.getType);
  }

  async openMenu() {
    this.menuCtrl.open('first');
  }

  async viewApproval(type: string) {
    let loading = await this.loadingCtrl.create({
      message: "loading " + type + " list",
    });
    await loading.present();
    this.store.dispatch(new ApprovalRequest(type))
      .subscribe({
        complete: async () => {
          console.log('completed');
          await loading.dismiss();
        }
      });
  }

}
