import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, PickerController, IonSelect, Platform } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { BookingService } from 'src/app/services/booking/booking.service';
import { PassengerModalComponent } from 'src/app/components/passenger-modal/passenger-modal.component';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { Select, Store } from '@ngxs/store';
import { SearchState } from 'src/app/stores/search.state';
import { Observable } from 'rxjs';
import { UpdateForm } from '@ngxs/form-plugin';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch: FormGroup;
  @ViewChild('select', { static: true }) select: IonSelect;

  @Select(SearchState.oneWayState) formState: Observable<any>;

  constructor(
    public modalCtrl: ModalController,
    public pickrCtrl: PickerController,
    public fb: FormBuilder,
    public booking: BookingService,
    public platform: Platform,
    public store : Store
  ) {
  }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({
      from: this.fb.control(null),
      to: this.fb.control(null),
      departure: this.fb.control(new Date()),
      traveller : this.fb.control(null),
      class : this.fb.control(null)
    });

    this.oneWaySearch.valueChanges.subscribe(
      (value) => {
        console.log(value);

        this.store.dispatch(new UpdateForm({
          value: this.oneWaySearch.value,
          dirty: this.oneWaySearch.dirty,
          status: this.oneWaySearch.status,
          errors: this.oneWaySearch.errors,
          path: "search.oneWaySearch"
        }));
      }
    );
  }

  async selectCity(field) {
    const modal = await this.modalCtrl.create({
      component: CityModalComponent
    });

    modal.onDidDismiss().then(
      (selectedCity) => {
        if (selectedCity.role == "backdrop") {
          return;
        }
        this.oneWaySearch.controls[field].patchValue(selectedCity.data);
      }
    );

    return await modal.present();
  }

  swapTrip() {
    let from = this.oneWaySearch.value.from;
    let to = this.oneWaySearch.value.to;
    this.oneWaySearch.controls['from'].patchValue(to);
    this.oneWaySearch.controls['to'].patchValue(from);
  }

  async selectDate() {
    const options: CalendarModalOptions = {
      title: 'DEPARTURE',
      pickMode: 'single',
      color: 'dark',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: 'Close',
      doneLabel: 'OK',
      defaultDate: this.oneWaySearch.controls['departure'].value
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
      this.oneWaySearch.controls['departure'].patchValue(event.data.dateObj);
    }
    else if (event.role == 'cancel') {
      return; 
    }

  }

  searchFlight() {
    this.booking.search('flight');
  }

  async selectPassengers() {
    const modal = await this.modalCtrl.create({
      component: PassengerModalComponent,
      componentProps: {
        currentPassengers : this.oneWaySearch.controls['traveller'].value
      },
      showBackdrop : true,
      backdropDismiss : true,
      cssClass: 'passenger'
    });

    modal.onDidDismiss().then(
      (selecetedPassenger) => {
        if (selecetedPassenger.role == "backdrop") {
          return;
        }
        this.oneWaySearch.controls['traveller'].patchValue(selecetedPassenger.data);
      }
    );

    return await modal.present();
  }

  selectClass() {
    this.select.open();
  }
}
