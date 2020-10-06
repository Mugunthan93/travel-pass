import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { PassengerDetailComponent } from '../../flight/passenger-detail/passenger-detail.component';
import * as _ from 'lodash';
import { BookState } from 'src/app/stores/book.state';
import { flightpassenger, FlightPassengerState, SelectPassenger, DeselectPassenger, DeletePassenger, DismissFlightPassenger } from 'src/app/stores/passenger/flight.passenger.states';
import { DismissHotelPassenger, HotelPassengerState, hotelpassenger, SelectAdultPassenger, DeSelectAdultPassenger, SelectChildPassenger, DeSelectChildPassenger, DeleteAdultPassenger, DeleteChildPassenger } from 'src/app/stores/passenger/hotel.passenger.state';
import { AddGuestComponent } from '../../hotel/add-guest/add-guest.component';
import { user } from 'src/app/models/user';
import { CompanyState } from 'src/app/stores/company.state';
import { ListEmployeeComponent } from '../list-employee/list-employee.component';
import { groupBy, mergeMap, toArray, map, reduce } from 'rxjs/operators';
import { TrainPassengerState, trainpassengerstate, trainpassenger, SelectTrainPassenger, DeselectTrainPassenger, EditTrainPassenger, DeleteTrainPassenger, DismissTrainPassenger } from 'src/app/stores/passenger/train.passenger.state';
import { TravellerDetailComponent } from '../../train/traveller-detail/traveller-detail.component';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.scss'],
})
export class PassengerListComponent implements OnInit {

  bookMode$: Observable<string>;
  bookMode: string;

  employees: user[];

  passengers$: Observable<flightpassenger[]>;
  selectedPassengers$: Observable<flightpassenger[]>;
  selected$: Observable<number>;
  count$: Observable<number>;

  hotelAdult$: Observable<hotelpassenger[]>;
  selectAdult$: Observable<hotelpassenger[]>;
  selectedAdult$: Observable<number>;
  totalAdult$: Observable<number>;

  hotelChildren$: Observable<hotelpassenger[]>;
  selectChildren$: Observable<hotelpassenger[]>;
  selectedChildren$: Observable<number>;
  totalChildren$: Observable<number>;

  trainPassengers$: Observable<trainpassenger[]>;
  selectedTrainPassengers$: Observable<trainpassenger[]>;
  selectedPass$: Observable<number>;
  countPass$: Observable<number>;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public popCtrl: PopoverController,
    private store: Store
  ) { }

  ngOnInit() {

    this.bookMode$ = this.store.select(BookState.getBookMode);
    this.bookMode = this.store.selectSnapshot(BookState.getBookMode);

    this.employees = this.store.selectSnapshot(CompanyState.getEmployees);

    this.passengers$ = this.store.select(FlightPassengerState.getPassengers);
    this.selectedPassengers$ = this.store.select(FlightPassengerState.getSelectedPassengers);
    this.selected$ = this.store.select(FlightPassengerState.getSelected);
    this.count$ = this.store.select(FlightPassengerState.getCount);

    this.hotelAdult$ = this.store.select(HotelPassengerState.GetAdult);
    this.selectAdult$ = this.store.select(HotelPassengerState.GetSelectAdult);
    this.totalAdult$ = this.store.select(HotelPassengerState.GetTotalAdult);
    this.selectedAdult$ = this.store.select(HotelPassengerState.GetSelectedAdult);


    this.hotelChildren$ = this.store.select(HotelPassengerState.GetChild);
    this.selectChildren$ = this.store.select(HotelPassengerState.GetSelectChildren);
    this.totalChildren$ = this.store.select(HotelPassengerState.GetTotalChildren);
    this.selectedChildren$ = this.store.select(HotelPassengerState.GetSelectedChildren);

    this.trainPassengers$ = this.store.select(TrainPassengerState.getPassenger);
    this.selectedTrainPassengers$ = this.store.select(TrainPassengerState.getSelectPassenger);
    this.selectedPass$ = this.store.select(TrainPassengerState.getSelectedPassCount);
    this.countPass$ = this.store.select(TrainPassengerState.getPassCount);

  }

  //flight passenger function

  async getDetail() {

    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'add',
        pax: null
      },
      id: 'passenger-details'
    });

    return await modal.present();
  }

  getPass(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeselectPassenger(evt.detail.value));
    }
  }

  async editPassenger(pax: flightpassenger) {
    const modal = await this.modalCtrl.create({
      component: PassengerDetailComponent,
      componentProps: {
        form: 'edit',
        pax: pax
      },
      id: 'passenger-details'
    });

    return await modal.present();
  }

  deletePassenger(pax: flightpassenger) {
    this.store.dispatch(new DeletePassenger(pax));
  }

  gender(pax: flightpassenger): string {
    if (pax.Gender == null) {
      switch (pax.Title) {
        case 'Mr': return 'Male';
        case 'Mstr': return 'Male';
        case 'Ms': return 'Female';
        case 'Mrs': return 'Female';
      }
    }
    switch (pax.Gender) {
      case 1: return 'Male';
      case 2: return 'Female';
    }
  }

  //hotel adult function

  async addAdult() {
    const modal = await this.modalCtrl.create({
      component: AddGuestComponent,
      componentProps: {
        form: 'add',
        pax: null,
        paxtype: 1,
        lead: false
      },
      id: 'guest-details'
    });

    return await modal.present();
  }

  async addEmployee(evt: CustomEvent) {
    
    let emp = of(...this.employees)
      .pipe(
        groupBy(p => p.designation),
        mergeMap((group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], []))),
        toArray(),
        map(
          (el) => {
            return el;
          }
        )
      );

    const popEmployee = await this.popCtrl.create({
      component: ListEmployeeComponent,
      componentProps: {
        employee: emp
      },
      event: evt,
      cssClass: 'employee-list',
      id: 'employee-list',
      translucent: true
    });

    return await popEmployee.present();
  }

  getAdult(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectAdultPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeSelectAdultPassenger(evt.detail.value));
    }
  }

  async editAdult(pax : hotelpassenger) {
    const modal = await this.modalCtrl.create({
      component: AddGuestComponent,
      componentProps: {
        form: 'edit',
        pax: pax,
        paxtype: 1,
        lead: pax.LeadPassenger
      },
      id: 'guest-details'
    });

    return await modal.present();

  }

  deleteAdult(pax: hotelpassenger) {
    this.store.dispatch(new DeleteAdultPassenger(pax));
  }

  //hotel child function

  async addChild() {
    const modal = await this.modalCtrl.create({
      component: AddGuestComponent,
      componentProps: {
        form: 'add',
        pax: null,
        paxtype: 2,
        lead: false
      },
      id: 'guest-details'
    });

    return await modal.present();
  }

  async editChild(pax: hotelpassenger) {
    const modal = await this.modalCtrl.create({
      component: AddGuestComponent,
      componentProps: {
        form: 'edit',
        pax: pax,
        paxtype: 2,
        lead: false
      },
      id: 'guest-details'
    });

    return await modal.present();
  }

  getChild(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectChildPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeSelectChildPassenger(evt.detail.value));
    }
  }

  deleteChild(pax: hotelpassenger) {
    this.store.dispatch(new DeleteChildPassenger(pax));
  }


  ///train function

  async addTrainPassenger(type : string) {
    const modal = await this.modalCtrl.create({
      component: TravellerDetailComponent,
      componentProps: {
        form: 'add',
        pax: null,
        paxtype: type,
        lead: false
      },
      id: 'traveller-details'
    });

    return await modal.present();
  }

  getTrainPass(evt: CustomEvent) {
    if (evt.detail.checked) {
      this.store.dispatch(new SelectTrainPassenger(evt.detail.value));
    }
    else if (!evt.detail.checked) {
      this.store.dispatch(new DeselectTrainPassenger(evt.detail.value));
    }
  }
  
  async editTrainPassenger(pax: trainpassenger) {
    const modal = await this.modalCtrl.create({
      component: TravellerDetailComponent,
      componentProps: {
        form: 'edit',
        pax: pax,
        paxtype: pax.pax_type,
        lead: pax.primary
      },
      id: 'traveller-details'
    });

    return await modal.present();
  }

  deleteTrainPassenger(pax : trainpassenger) {
    this.store.dispatch(new DeleteTrainPassenger(pax));
  }

  ///dismiss
  dismissInfo() {
    if (this.bookMode == 'flight') {
      this.store.dispatch(new DismissFlightPassenger());
    }
    else if (this.bookMode == 'hotel') {
      this.store.dispatch(new DismissHotelPassenger());
    }
    else if (this.bookMode == 'train') {
      this.store.dispatch(new DismissTrainPassenger());
    }
  }

}
