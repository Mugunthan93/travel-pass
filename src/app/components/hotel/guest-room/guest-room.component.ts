import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { roomguest, HotelSearchState, AddRoom, DeleteRoom, AddAdult, RemoveAdult, AddChild, RemoveChild, SetAge, DismissRoom } from 'src/app/stores/search/hotel.state';
import { Store } from '@ngxs/store';
import { ModalController, AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-guest-room',
  templateUrl: './guest-room.component.html',
  styleUrls: ['./guest-room.component.scss'],
})
export class GuestRoomComponent implements OnInit {

  rooms$: Observable<roomguest[]>;
  ages: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  customAlertOptions: AlertOptions;


  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.rooms$ = this.store.select(HotelSearchState.getRooms);
    this.customAlertOptions = {
      header: 'Child Age',
      cssClass: 'cabinClass'
    }
  }
  
  addRoom() {
    this.store.dispatch(new AddRoom());
  }

  deleteRoom(index : number) {
    this.store.dispatch(new DeleteRoom(index));
  }

  increase(type: string, ind: number) {
    if (type == 'adult') {
      this.store.dispatch(new AddAdult(ind));
    }
    else if (type == 'children') {
      this.store.dispatch(new AddChild(ind));
    }
  }

  decrease(type : string, ind : number) {
    if (type == 'adult') {
      this.store.dispatch(new RemoveAdult(ind));
    }
    else if (type == 'children') {
      this.store.dispatch(new RemoveChild(ind));
    }
  }

  selectedAge(evt : CustomEvent,ageIndex : number,roomIndex : number) {
    this.store.dispatch(new SetAge(evt.detail.value,ageIndex,roomIndex));
  }

  dismiss() {
    this.store.dispatch(new DismissRoom());
  }

}
