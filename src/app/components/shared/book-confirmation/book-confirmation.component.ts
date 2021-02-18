import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { user } from 'src/app/models/user';
import { UserState } from 'src/app/stores/user.state';
import { CompanyState } from 'src/app/stores/company.state';
import { ResultState } from 'src/app/stores/result.state';
import { AlertOptions } from '@ionic/core';
import { MailCC, Purpose, Comments, SendRequest, BookTicket, OfflineRequest } from 'src/app/stores/book.state';

@Component({
  selector: 'app-book-confirmation',
  templateUrl: './book-confirmation.component.html',
  styleUrls: ['./book-confirmation.component.scss'],
})
export class BookConfirmationComponent implements OnInit {

  @Input() type : string;


  managers$: Observable<user[]>;
  approverName$: Observable<string>;
  isAdmin$: Observable<boolean>;
  requestType: string;
  appovalStatus$ : Observable<boolean>;

  ccAlertOptions: AlertOptions;
  purposeAlertOptions: AlertOptions;

  purposeArray: string[] = ['Project', 'Offsite meet', 'Sales', 'Support', 'Internal', 'Conference', 'Training', 'Other', 'Business meet'];
  currentPurpose: string = null;

  constructor(
    private store : Store,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {

    this.approverName$ = this.store.select(UserState.getApproverName);
    this.managers$ = this.store.select(CompanyState.getManagerList);
    this.requestType = this.store.selectSnapshot(ResultState.getResultType);
    this.isAdmin$ = this.store.select(UserState.isAdmin);
    this.appovalStatus$ = this.store.select(CompanyState.getApprovalStatus); 

    this.ccAlertOptions = {
      cssClass: 'cc'
    }

    this.purposeAlertOptions = {
      cssClass: 'purpose'
    }

  }

  mail(evt: CustomEvent) {
    this.store.dispatch(new MailCC(evt.detail.value));
  }

  purpose(evt: CustomEvent) {
    this.currentPurpose = evt.detail.value;
    this.store.dispatch(new Purpose(evt.detail.value));
  }

  comment(evt: CustomEvent) {
    this.store.dispatch(new Comments(evt.detail.value));
  }

  async sendRequest() {
    let missing = await this.alertCtrl.create({
      header: 'Purpose Missing',
      subHeader: 'Select the purpose',
      id: 'passenger-check',
      buttons: [{
        text: "Ok",
        handler: async () => {
          await missing.dismiss();
        }
      }]
    });

    if (this.currentPurpose !== null) {
      this.store.dispatch(new SendRequest());
    }
    else {
      return await missing.present();
    }


  }

  async offlineRequest() {
    let missing = await this.alertCtrl.create({
      header: 'Purpose Missing',
      subHeader: 'Select the purpose',
      id: 'passenger-check',
      buttons: [{
        text: "Ok",
        handler: async () => {
          await missing.dismiss();
        }
      }]
    });

    if (this.currentPurpose !== null) {
      this.store.dispatch(new OfflineRequest());
    }
    else {
      return await missing.present();
    }
  }

  async bookRequest() {
    let missing = await this.alertCtrl.create({
      header: 'Purpose Missing',
      subHeader: 'Select the purpose',
      id: 'passenger-check',
      buttons: [{
        text: "Ok",
        handler: async () => {
          await missing.dismiss();
        }
      }]
    });

    if (this.currentPurpose !== null) {
      this.store.dispatch(new BookTicket());
    }
    else {
      return await missing.present();
    }
  }

  
  async dismiss() {
    return await this.modalCtrl.dismiss(null, null,'book-confirm');
  }

}
