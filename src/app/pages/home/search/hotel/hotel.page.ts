import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GuestRoomComponent } from 'src/app/components/guest-room/guest-room.component';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  async selectRoom() {
    const modal = await this.modalCtrl.create({
      component: GuestRoomComponent
    });

    modal.onDidDismiss().then(
      (selectedRoom) => {
        console.log(selectedRoom);
      }
    );

    return await modal.present();
  }

}
