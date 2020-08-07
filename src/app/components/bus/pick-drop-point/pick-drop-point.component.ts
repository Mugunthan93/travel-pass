import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pick-drop-point',
  templateUrl: './pick-drop-point.component.html',
  styleUrls: ['./pick-drop-point.component.scss'],
})
export class PickDropPointComponent implements OnInit {

  points: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectPoint: boolean = false;

  constructor(
    private store: Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  selectpoint() {
    this.selectPoint = true;
  }

  showDate(point, points) {
    console.log(point, points);
    return true;
  }

  bookBus() {
    this.modalCtrl.dismiss(null, null, 'seat-select');
    this.modalCtrl.dismiss(null, null, 'pick-drop');
    this.store.dispatch(new Navigate(['/','home','book','bus']));
  }

}
