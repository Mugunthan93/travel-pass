import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSelect } from '@ionic/angular';
import { GuestRoomComponent } from 'src/app/components/hotel/guest-room/guest-room.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CityModalComponent } from 'src/app/components/shared/city-modal/city-modal.component';
import { roomguest, HotelSearchState, HotelForm, SearchHotel } from 'src/app/stores/search/hotel.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RoomValidator } from 'src/app/validator/room.validator';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { AlertOptions } from '@ionic/core';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit {

  hotelSearch: FormGroup;
  formSubmit: boolean = false;
  rooms$: Observable<roomguest[]>;
  @ViewChild('select', { static: true }) select: IonSelect;
  customAlertOptions: AlertOptions;
  newDate: Date;

  stars: number[] = [1,2,3,4,5];


  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    private store : Store
  ) { }

  ngOnInit() {

    this.rooms$ = this.store.select(HotelSearchState.getRooms);

    this.hotelSearch = new FormGroup({
      'city': new FormControl(null, [Validators.required]),
      'room': new FormControl(null, [Validators.required]),
      'nationality': new FormControl(null, [Validators.required]),
      'star': new FormControl(null, [Validators.required]),
      'checkin': new FormControl(null, [Validators.required]),
      'checkout': new FormControl(null, [Validators.required])
    });

    this.hotelSearch.valueChanges.subscribe(el => console.log(el));
    this.customAlertOptions = {
      header : 'Select Star',
      cssClass: 'cabinClass'
    }

    this.newDate = new Date();
  }

  async selectCity() {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        title: 'city'
        
      }
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        if (selectedCity.role == "backdrop") {
          return;
        }
        this.hotelSearch.controls['city'].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectRoom() {
    const modal = await this.modalCtrl.create({
      component: GuestRoomComponent
    });

    modal.onDidDismiss().then(
      (selectedRoom) => {
        if (selectedRoom.role == "backdrop") {
          return;
        }
        this.hotelSearch.controls['room'].patchValue(selectedRoom.data);
      }
    );

    return await modal.present();
  }

  async selectNationality() {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        title: 'nationality',
      }
    });

    modal.onDidDismiss().then(
      (selectedNationality) => {
        if (selectedNationality.role == "backdrop") {
          return;
        }
        this.hotelSearch.controls['nationality'].patchValue(selectedNationality.data);
      }
    );

    return await modal.present();
  }

  selectStar(evt : CustomEvent) {
    this.hotelSearch.controls['star'].patchValue(evt.detail.value);
  }

  async selectDate(field: string) {
    let FromDate: Date = this.newDate;
    if (field == 'checkout') {
      if (this.hotelSearch.controls['checkin'].value > this.hotelSearch.controls['checkout'].value) {
        this.hotelSearch.controls['checkout'].setValue(null);
      }
      FromDate = this.hotelSearch.controls['checkin'].value;
    }

    const options: CalendarModalOptions = {
      title: field.toLocaleUpperCase(),
      pickMode: 'single',
      color: 'dark',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.hotelSearch.controls[field].value,
      from: FromDate,
      to: 0
    }

    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: {
        options
      }
    });

    modal.present();

    const event: any = await modal.onDidDismiss();
    if (event.role == 'done') {
      if (field == 'checkin' && event.data.dateObj > this.hotelSearch.controls['checkout'].value) {
        this.hotelSearch.controls['checkout'].setValue(null);
      }
      this.hotelSearch.controls[field].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return;
    }

  }

  searchHotel() {
    this.formSubmit = true;
    console.log(this.hotelSearch);
    if (this.hotelSearch.valid) {
      this.store.dispatch(new HotelForm(this.hotelSearch.value));
      this.store.dispatch(new SearchHotel());
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

  totalAdult() : string {
    let rooms: roomguest[] = this.hotelSearch.value.room;
    let adults: number = 0;
    rooms.map(el => {
      adults += el.NoOfAdults;
    });

    return adults + ' Adult';
  }

  openStar() {
    this.select.open();
  }

}
