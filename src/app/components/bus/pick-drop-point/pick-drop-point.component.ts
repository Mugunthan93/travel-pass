import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { boardingPoint, droppingPoint, BusResultState, AddBoardingPoint, AddDroppingPoint, GetBusBook } from 'src/app/stores/result/bus.state';

@Component({
  selector: 'app-pick-drop-point',
  templateUrl: './pick-drop-point.component.html',
  styleUrls: ['./pick-drop-point.component.scss'],
})
export class PickDropPointComponent implements OnInit {

  selectedPoint$: BehaviorSubject<string> = new BehaviorSubject<string>('boarding');
  boarding$: Observable<boardingPoint[]>;
  dropping$: Observable<droppingPoint[]>;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.boarding$ = this.store.select(BusResultState.getBoardingPoints);
    this.dropping$ = this.store.select(BusResultState.getDroppingPoints);
  }

  changePoint(evt: CustomEvent) {
    this.selectedPoint$.next(evt.detail.value);
  }

  bookBus() {
    this.store.dispatch(new GetBusBook());
  }

  selectBoard(pt : boardingPoint) {
    this.store.dispatch(new AddBoardingPoint(pt));
  }

  selectDrop(pt : droppingPoint) {
    this.store.dispatch(new AddDroppingPoint(pt));
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null,'pick-drop');
  }

}
