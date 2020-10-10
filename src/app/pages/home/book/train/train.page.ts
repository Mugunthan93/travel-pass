import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { PassengerState } from 'src/app/stores/passenger.state';

@Component({
  selector: 'app-train',
  templateUrl: './train.page.html',
  styleUrls: ['./train.page.scss'],
})
export class TrainPage implements OnInit,OnDestroy {

  constructor(
    private store : Store
  ) { }

  
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StateReset(PassengerState));
  }

}
