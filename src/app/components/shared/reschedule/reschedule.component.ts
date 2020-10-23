import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BookingState, RescheduleTicket } from 'src/app/stores/booking.state';
import { ModalController } from '@ionic/angular';
import { city } from 'src/app/stores/shared.state';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { CalendarModalOptions, CalendarModal } from 'ion2-calendar';
import { formatDate } from '@angular/common';
import { SelectModalComponent } from '../select-modal/select-modal.component';

export interface req_segment {
  Origin: string
  OriginName: string
  Destination: string
  DestinationName: string
  FlightCabinClass: string
  PreferredDepartureTime: string
  PreferredArrivalTime: string
}

@Component({
  selector: "app-reschedule",
  templateUrl: "./reschedule.component.html",
  styleUrls: ["./reschedule.component.scss"],
})
export class RescheduleComponent implements OnInit {
  ticket$: Observable<any>;
  ticket: any;
  type$: Observable<string>;
  type: string;

  modifiedSector: req_segment[] = [];

  rescheduleForm: FormGroup;
  trips: FormArray;

  constructor(
    private store: Store,
    public modalCtrl: ModalController,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ticket$ = this.store.select(BookingState.getRescheduleTicket);
    this.ticket = this.store.selectSnapshot(BookingState.getRescheduleTicket);
    this.type$ = this.store.select(BookingState.getType);
    this.type = this.store.selectSnapshot(BookingState.getType);

    this.rescheduleForm = this.fb.group({
      trips: this.fb.array([]),
      remark: this.fb.control(null,[Validators.required]),
    });

    this.trips = this.rescheduleForm.get("trips") as FormArray;
    (this.ticket.trip_requests.Segments as Array<any>).forEach((el,ind) => {
      this.trips.push(this.segmentTrip(el,ind));
    });

    this.rescheduleForm.valueChanges.subscribe((el) =>
      console.log(this.rescheduleForm)
    );
  }

  TripType(): Observable<string> {
    return this.ticket$.pipe(
      map((tkt: any) => {
        return tkt.trip_type;
      })
    );
  }

  gePNR(): Observable<string> {
    return this.ticket$.pipe(
      map((tkt: any) => {
        let pnr = JSON.parse(tkt.passenger_details.PNR);
        return pnr[0];
      })
    );
  }

  async selectCity(trips: any,ind : number, field: string) {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        title: "city",
        type: "flight",
      },
    });

    modal.onDidDismiss().then((selectedCity) => {
      if (selectedCity.role == "backdrop") {
        return;
      }
      console.log(selectedCity);
      if (field == 'from') { 
        this.modifiedSector[ind].Origin = selectedCity.data.city_code;
        this.modifiedSector[ind].OriginName = selectedCity.data.city_name;
        trips.controls[field].patchValue(this.modifiedSector[ind].OriginName);
      }
      else if (field == 'to') { 
        this.modifiedSector[ind].Destination = selectedCity.data.city_code;
        this.modifiedSector[ind].DestinationName = selectedCity.data.city_name;
        trips.controls[field].patchValue(this.modifiedSector[ind].DestinationName);
      }
    });

    return await modal.present();
  }

  async getDate(trips: any, i: number) {
    console.log(trips, i);
    let FromDate: Date = new Date();
    if (i < 0) {
      if (
        trips[i].controls["date"].value > trips[i + 1].controls["date"].value
      ) {
        trips[i + 1].controls["date"].setValue(null);
      }
    }
    if (i >= 1) {
      let k: number = i - 1;
      let fromdateIndex: number = k;
      for (k; k > -1; k--) {
        if (trips[k].controls["date"].value !== null) {
          fromdateIndex = k;
          break;
        }
      }
      console.log(fromdateIndex);
      FromDate = trips[fromdateIndex].controls["date"].value;
    }

    const options: CalendarModalOptions = {
      title: "DEPARTURE",
      pickMode: "single",
      color: "#e87474",
      cssClass: "ion2-calendar",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekStart: 1,
      canBackwardsSelected: false,
      closeLabel: "Close",
      doneLabel: "OK",
      defaultDate: trips[i].controls["date"].value,
      from: FromDate,
    };
    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: {
        options,
      },
    });

    await modal.present();

    const event: any = await modal.onDidDismiss();
    if (event.role == "done") {
      console.log(event.data.dateObj);

      if (
        i > 0 &&
        i !== trips.length - 1 &&
        event.data.dateObj > trips[i + 1].controls["date"].value
      ) {
        trips[i + 1].controls["date"].setValue(null);
      }
      trips[i].controls["date"].patchValue(formatDate(event.data.dateObj,"dd-MM-yyyy","en"));
    } else if (event.role == "cancel") {
      return;
    }
  }

  segmentTrip(el : any, ind : number) {
    let date = formatDate(el.PreferredDepartureTime, "DD-MM-YYYY", "en");

    this.modifiedSector[ind] = {
      Origin: el.Origin,
      Destination: el.Destination,
      OriginName: el.OriginName,
      DestinationName: el.DestinationName,
      FlightCabinClass: el.FlightCabinClass,
      PreferredDepartureTime: el.PreferredDepartureTime,
      PreferredArrivalTime: el.PreferredArrivalTime
    };

    console.log(date);
    return this.fb.group({
      from: this.fb.control(this.modifiedSector[ind].OriginName, [
        Validators.required,
      ]),
      to: this.fb.control(this.modifiedSector[ind].DestinationName, [
        Validators.required,
      ]),
      date: this.fb.control(this.modifiedSector[ind].PreferredDepartureTime, [
        Validators.required,
      ]),
    });
  }

  setDate(evt : CustomEvent,trip : any,ind : number) {
    this.modifiedSector[ind].PreferredDepartureTime = evt.detail.value;
    this.modifiedSector[ind].PreferredArrivalTime = evt.detail.value;
    trip.controls["date"].patchValue(this.modifiedSector[ind].PreferredDepartureTime);
  }

  journeyType(): Observable<string> {
    return this.ticket$.pipe(
      map((tkt: any) => {
        switch (tkt.trip_requests.JourneyType) {
          case 1:
            return "One - Way";
          case 2:
            return "Round - Trip";
          case 3:
            return "Multi - City";
        }
      })
    );
  }

  travelType(): Observable<string> {
    return this.ticket$.pipe(
      map((tkt: any) => {
        return tkt.trip_requests.Segments.reduce((acc, curr) => {
          let code = [curr.OriginCountryCode, curr.DestinationCountryCode];
          return code;
        }, []);
      }),
      map((res) => {
        return (res as Array<string>).every((val) => val === res[0]) ? "Domestic" : "International";
      })
    );
  }

  passenger(): Observable<any[]> {
    return this.ticket$.pipe(
      map((detail) => {
        switch (this.type) {
          case "flight":
            return detail.passenger_details.passenger;
          case "hotel":
            return detail.guest_details.passengers;
          case "bus":
            return detail.passenger_details.blockSeatPaxDetails;
        }
      })
    );
  }

  passengerTitle(passenger: any, i: number) {
    switch (this.type) {
      case "flight":
        passenger.IsLeadPax ? "Lead Passenger" : "Passenger " + i;
      case "hotel":
        passenger.LeadPassenger ? "Lead Passenger" : "Passenger " + i;
    }
  }

  submitReschedule() {
    console.log(this.rescheduleForm);
    if (this.rescheduleForm.valid) {
      this.store.dispatch(
        new RescheduleTicket(this.modifiedSector, this.rescheduleForm.value.remark)
      );
    }
  }

  applyReschedule() {
    
  }

  dismiss() {
    this.modalCtrl.dismiss(null, null, "reschedule-ticket");
  }

  error(form : FormGroup,field : string) {
    return {
      'is-valid': form.controls[field].valid,
      'is-invalid': form.controls[field].invalid
    }
  }
}
