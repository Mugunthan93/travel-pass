import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SeatSelectComponent } from 'src/app/components/bus/seat-select/seat-select.component';
import { Observable } from 'rxjs';
import { busResponse, BusResultState, SeatLayout } from 'src/app/stores/result/bus.state';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { sortButton, SortState } from 'src/app/stores/result/sort.state';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  busresut$: Observable<busResponse[]>;
  sortBy$: Observable<sortButton>;

  constructor(
    public modalCtrl: ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.busresut$ = this.store.select(BusResultState.getBusResult);
    this.sortBy$ = this.store.select(SortState.getBusSortBy);
  }

  departTime(time : string) {
    return moment(time, ["h:mm A"]).format("HH:mm");
  }

  duration(mins : number) {
    return moment.duration(mins, 'minutes').hours() + 'h ' + moment.duration(mins, 'minutes').minutes() + 'm';
  }

  arrivalTime(time : string) {
    return moment(time, ["h:mm A"]).format("HH:mm");
  }

  async selectBus(busDetail: busResponse) {

    const modal = await this.modalCtrl.create({
      component: SeatSelectComponent,
      id : 'seat-select'
    });

    this.store.dispatch(new SeatLayout(busDetail))
      .subscribe({
        complete: async () => {
          await modal.present();
        }
      });
    
  }
}
