import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/components/shared/select-modal/select-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Store } from '@ngxs/store';
import { SearchBus } from 'src/app/stores/search/bus.state';

export interface seats {
  seat: number
  value: string
  selection: boolean
}

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  seats: any[];
  recent_searches: any[];
  newDate: Date;
  Return: boolean = false;

  busSearch: FormGroup;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {

    this.newDate = new Date();

    this.seats = [
      { seat: 1, value: "1", selection: true },
      { seat: 2, value: "2", selection: false },
      { seat: 3, value: "3", selection: false },
      { seat: 4, value: "4", selection: false },
      { seat: 5, value: "5", selection: false },
      { seat: 6, value: "6", selection: false }
    ];

    this.recent_searches = [1, 2, 3];
    
    this.busSearch = new FormGroup({
      'source': new FormControl(null,[Validators.required]),
      'destination': new FormControl(null,[Validators.required]),
      'departure': new FormControl(this.newDate, [Validators.required]),
      'return': new FormControl(null),
      'seat': new FormControl(1,[Validators.required])
    });

    this.busSearch.valueChanges.subscribe(el => console.log(el));

  }

  selectedSeat(seat: seats) {
    this.seats.forEach(
      (seat) => {
        seat.selection = false;
      }
    );
    seat.selection = !seat.selection;
    this.busSearch.controls['seat'].setValue(seat.seat);
  }

  async selectCity(field : string) {
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
        this.busSearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  async selectDate(field: string) {
    
    let FromDate: Date = this.newDate;
    if (field == 'return') {
      if (this.busSearch.controls['departure'].value > this.busSearch.controls['return'].value) {
        this.busSearch.controls['return'].setValue(null);
      }
      FromDate = this.busSearch.controls['departure'].value;
    }

    const options: CalendarModalOptions = {
      title: field.toLocaleUpperCase(),
      pickMode: 'single',
      color: '#e87474',
      cssClass: 'ion2-calendar',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.busSearch.controls[field].value,
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
    console.log(event);
    if (event.role == 'done') {
      if (field == 'departure' && event.data.dateObj > this.busSearch.controls['return'].value) {
        this.busSearch.controls['return'].setValue(null);
      }
      this.busSearch.controls[field].patchValue(event.data.dateObj);
      if (field == 'return') {
        this.Return = true;
      }
    }
    else if (event.role == 'cancel') {
      if (field == 'return') {
        this.Return = false;
      }
      return;
    }

  }

  swapBus() {
    let source = this.busSearch.value.soure;
    let destination = this.busSearch.value.destination;
    console.log(source, destination);
    this.busSearch.controls['source'].patchValue(destination);
    this.busSearch.controls['destination'].patchValue(source);
  }

  async addReturn() {
    await this.selectDate('return');
  }

  async removeReturn() {
    this.Return = false;
  }

  searchBus() {
    this.store.dispatch(new SearchBus(this.busSearch.value));
  }

}