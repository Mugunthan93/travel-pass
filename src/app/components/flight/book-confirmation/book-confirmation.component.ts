import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AlertOptions } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { user } from 'src/app/models/user';
import { CompanyState } from 'src/app/stores/company.state';
import { UserState } from 'src/app/stores/user.state';
import { MailCC, Purpose, Comments } from 'src/app/stores/book/flight.state';
import { DomesticSendRequest } from 'src/app/stores/book/flight/domestic.state';
import { ResultState } from 'src/app/stores/result.state';
import { OneWaySendRequest } from 'src/app/stores/book/flight/oneway.state';
import { MultiCitySendRequest } from 'src/app/stores/book/flight/multi-city.state';

@Component({
  selector: 'app-book-confirmation',
  templateUrl: './book-confirmation.component.html',
  styleUrls: ['./book-confirmation.component.scss'],
})
export class BookConfirmationComponent implements OnInit {

  ccAlertOptions: AlertOptions;
  purposeAlertOptions: AlertOptions;
  managers$: Observable<user[]>;
  approverName$: Observable<string>;
  requestType: string;


  purposeArray : string[] = ['Project', 'Offsite meet', 'Sales', 'Support', 'Internal', 'Conference', 'Training', 'Other', 'Business meet'];

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) {
    this.approverName$ = this.store.select(UserState.getApproverName);
    this.managers$ = this.store.select(CompanyState.getManagerList);
    this.requestType = this.store.selectSnapshot(ResultState.getResultType);
   }

  ngOnInit() {

    this.ccAlertOptions = {
      cssClass: 'cc'
    }

    this.purposeAlertOptions = {
      cssClass: 'purpose'
    }

  }

  mail(evt : CustomEvent) {
    this.store.dispatch(new MailCC(evt.detail.value));
  }
  
  purpose(evt: CustomEvent) {
    this.store.dispatch(new Purpose(evt.detail.value));
  }

  comment(evt: CustomEvent) {
    this.store.dispatch(new Comments(evt.detail.value));
  }

  sendRequest() {
    if (this.requestType == 'one-way') {
      this.store.dispatch(new OneWaySendRequest());
    }
    else if (this.requestType == 'animated-round-trip') {
      this.store.dispatch(new DomesticSendRequest());
    }
    else if (this.requestType == 'multi-city') {
      this.store.dispatch(new MultiCitySendRequest());
      
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
