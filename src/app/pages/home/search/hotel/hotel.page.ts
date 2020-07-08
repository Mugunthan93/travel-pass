import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GuestRoomComponent } from 'src/app/components/hotel/guest-room/guest-room.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  hotelSearch: FormGroup;
  formSubmit: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public router : Router
  ) { }

  ngOnInit() {

    this.hotelSearch = new FormGroup({
      'city': new FormControl(null,[Validators.required]),
      'rooms': new FormControl(null, [Validators.required]),
      'nationality': new FormControl(null, [Validators.required]),
      'star': new FormControl(null, [Validators.required]),
      'checkin': new FormControl(null, [Validators.required]),
      'checkout': new FormControl(null, [Validators.required])
    });

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

  searchHotel() {
    this.formSubmit = true;
    if (this.hotelSearch.valid) {
      this.router.navigate(['/','home','result','hotel']);
    }
  }

  errorClass(name: string) {
    return {
      'initial': (this.hotelSearch.controls[name].value == null) && !this.formSubmit,
      'valid':
        this.hotelSearch.controls[name].value !== null ||
        (this.hotelSearch.controls[name].valid && !this.formSubmit) ||
        (this.hotelSearch.controls[name].valid && this.formSubmit),
      'invalid':
        (this.hotelSearch.controls[name].invalid && this.formSubmit)
    }
  }

}
