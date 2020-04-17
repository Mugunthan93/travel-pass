import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GuestRoomComponent } from 'src/app/components/hotel/guest-room/guest-room.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public router : Router
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

  searchRoom() {
    this.router.navigate(['/','home','result','hotel']);
  }

}
