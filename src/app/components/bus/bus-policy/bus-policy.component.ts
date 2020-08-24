import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { BusResultState } from 'src/app/stores/result/bus.state';

@Component({
  selector: 'app-bus-policy',
  templateUrl: './bus-policy.component.html',
  styleUrls: ['./bus-policy.component.scss'],
})
export class BusPolicyComponent implements OnInit {

  policies$: Observable<any[]>;

  constructor(
    public modalCtrl: ModalController,
    private store: Store
  ) {
  }
  
  ngOnInit() {
    this.policies$ = this.store.select(BusResultState.getPolicies);
    this.policies$.subscribe(el => console.log(el));
  }
  
  dismiss() {
    this.modalCtrl.dismiss(null,null,'bus-policy');
  }

}
