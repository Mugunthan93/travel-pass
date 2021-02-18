import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddInventoryRooms, HotelResultState, inventory, RemoveInventoryRooms, SendInventory } from 'src/app/stores/result/hotel.state';

@Component({
  selector: 'app-inventory-rooms',
  templateUrl: './inventory-rooms.component.html',
  styleUrls: ['./inventory-rooms.component.scss'],
})
export class InventoryRoomsComponent implements OnInit {

  rooms$ : Observable<inventory[]>;
  selectedRooms : inventory[];

  constructor(
    private store : Store,
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.rooms$ = this.store.select(HotelResultState.getInventoryRooms);
  }

  selectRoom(evt) {
    console.log(evt);
    if(evt.detail.checked) {
      this.store.dispatch(new AddInventoryRooms(evt.detail.value));
    }
    else if(!evt.detail.checked) {
      this.store.dispatch(new RemoveInventoryRooms(evt.detail.value));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  sendInventory() {
    this.store.dispatch(new SendInventory());
  }

}
