import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterState, GetFilter, airlineName, flightFilter } from 'src/app/stores/result/filter.state';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResultState } from 'src/app/stores/result.state';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.scss'],
})
export class TripFilterComponent implements OnInit {

  flightType: string;
  segment: string = 'departure';

  filterForm: FormGroup;
  departureForm: FormGroup;
  returnForm: FormGroup;

  airlines: FormGroup;
  depAirlines: FormGroup;
  reAirlines: FormGroup;

  defaultFilter: flightFilter = null;
  defaultDepFilter: flightFilter = null;
  defaultReFilter: flightFilter = null;

  inputs$: Observable<flightFilter>;
  departure$: Observable<flightFilter>;
  return$: Observable<flightFilter>;

  constructor(
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {

    this.flightType = this.store.selectSnapshot(ResultState.getResultType);

    this.inputs$ = this.store.select(FilterState.getFlightFilter);
    this.departure$ = this.store.select(FilterState.getDepartureFlightFilter);
    this.return$ = this.store.select(FilterState.getReturnFlightFilter);

    this.airlines = this.fb.group({});
    this.depAirlines = this.fb.group({});
    this.reAirlines = this.fb.group({});
    

    this.inputs$.subscribe(
      (res: flightFilter) => {

        this.defaultFilter = res;

        this.filterForm = this.fb.group({
          "stops": this.fb.control(res.stops),
          "depHours": this.fb.control(res.depatureHours),
          "arrHours": this.fb.control(res.arrivalHours),
          "price": this.fb.control(res.price),
          "corpFare": this.fb.control(res.corporateFare),
          "airlines": this.airlines
        });
    
        console.log(this.filterForm);

        res.airlines.forEach((el) => {
          this.airlines.addControl(el.name, this.fb.control(el.value));
        });
        
        this.filterForm.valueChanges.subscribe(el => console.log(el));
      
      });
    
    this.departure$.subscribe(
      (res: flightFilter) => {

        this.defaultDepFilter = res;

        this.departureForm = this.fb.group({
          "stops": this.fb.control(res.stops),
          "depHours": this.fb.control(res.depatureHours),
          "arrHours": this.fb.control(res.arrivalHours),
          "price": this.fb.control(res.price),
          "corpFare": this.fb.control(res.corporateFare),
          "airlines": this.depAirlines
        });

        res.airlines.forEach((el) => {
          this.depAirlines.addControl(el.name, this.fb.control(el.value));
        });

      });
    
    this.return$.subscribe(
      (res: flightFilter) => {

        this.defaultReFilter = res;

        this.returnForm = this.fb.group({
          "stops": this.fb.control(res.stops),
          "depHours": this.fb.control(res.depatureHours),
          "arrHours": this.fb.control(res.arrivalHours),
          "price": this.fb.control(res.price),
          "corpFare": this.fb.control(res.corporateFare),
          "airlines": this.reAirlines
        });

        res.airlines.forEach((el) => {
          this.reAirlines.addControl(el.name, this.fb.control(el.value));
        });

      });


  }

  changeType(evt : CustomEvent) {
    this.segment = evt.detail.value;
  }
  
  close() {
    this.modalCtrl.dismiss();
  }

  chooseStop(evt: CustomEvent) {
    if (this.segment == 'departure') {
      this.departureForm.controls['stops'].setValue(parseInt(evt.detail.value));
    }
    else if (this.segment == 'return') {
      this.returnForm.controls['stops'].setValue(parseInt(evt.detail.value));
    }
    else {
      this.filterForm.controls['stops'].setValue(parseInt(evt.detail.value));
    }
  }

  depRange(evt: CustomEvent) {
    if (this.segment == 'departure') {
      this.departureForm.controls['depHours'].setValue(parseInt(evt.detail.value));
    }
    else if (this.segment == 'return') {
      this.returnForm.controls['depHours'].setValue(parseInt(evt.detail.value));
    }
    else {
      this.filterForm.controls['depHours'].setValue(parseInt(evt.detail.value));
    }
  }

  reRange(evt: CustomEvent) {
    if (this.segment == 'departure') {
      this.departureForm.controls['arrHours'].setValue(parseInt(evt.detail.value));
    }
    else if (this.segment == 'return') {
      this.returnForm.controls['arrHours'].setValue(parseInt(evt.detail.value));
    }
    else {
      this.filterForm.controls['arrHours'].setValue(parseInt(evt.detail.value));
    }
  }

  priceRange(evt: CustomEvent) {
    if (this.segment == 'departure') {
      this.departureForm.controls['price'].setValue(parseInt(evt.detail.value));
    }
    else if (this.segment == 'return') {
      this.returnForm.controls['price'].setValue(parseInt(evt.detail.value));
    }
    else {
      this.filterForm.controls['price'].setValue(parseInt(evt.detail.value));
    }
  }

  corpFare(evt: CustomEvent) {
    if (this.segment == 'departure') {
      this.departureForm.controls['corpFare'].setValue(evt.detail.checked);
    }
    else if (this.segment == 'return') {
      this.returnForm.controls['corpFare'].setValue(evt.detail.checked);
    }
    else {
      this.filterForm.controls['corpFare'].setValue(evt.detail.checked);
    }
  }

  reset() {

    if (this.segment == 'departure') {
      let airline: airlineName[] = [];

      for (const key in this.departureForm.value.airlines) {
        airline.push({
          name: key,
          value: false
        });
      }

      let filter: flightFilter = {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: airline,
        price: 0
      }
      this.store.dispatch(new GetFilter(filter,'departure'));
    }

    else if (this.segment == 'return') {
      let airline: airlineName[] = [];

      for (const key in this.returnForm.value.airlines) {
        airline.push({
          name: key,
          value: false
        });
      }

      let filter: flightFilter = {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: airline,
        price: 0
      }
      this.store.dispatch(new GetFilter(filter,'return'));
    }

    else if (this.flightType !== 'animated-round-trip') {
      let airline: airlineName[] = [];
  
      for (const key in this.filterForm.value.airlines) {
        airline.push({
          name: key,
          value: false
        });
      }
  
      let filter: flightFilter = {
        stops: -1,
        depatureHours: 24,
        arrivalHours: 24,
        corporateFare: false,
        airlines: airline,
        price: 0
      }
      this.store.dispatch(new GetFilter(filter));
    }

  }

  filter() {

    if (this.filterForm.valid) {

      if (this.flightType == 'animated-round-trip') {
        let depairlines: airlineName[] = [];
        let reairlines: airlineName[] = [];

        for (const key in this.departureForm.value.airlines) {
          depairlines.push({
            name: key,
            value: this.departureForm.value.airlines[key]
          });
        }
  
        for (const key in this.returnForm.value.airlines) {
          reairlines.push({
            name: key,
            value: this.returnForm.value.airlines[key]
          });
        }
        let depfilter: flightFilter = {
          stops: this.departureForm.value.stops,
          depatureHours: this.departureForm.value.depHours,
          arrivalHours: this.departureForm.value.arrHours,
          corporateFare: this.departureForm.value.corpFare,
          airlines: depairlines,
          price: this.departureForm.value.price
        };
  
        let refilter: flightFilter = {
          stops: this.returnForm.value.stops,
          depatureHours: this.returnForm.value.depHours,
          arrivalHours: this.returnForm.value.arrHours,
          corporateFare: this.returnForm.value.corpFare,
          airlines: reairlines,
          price: this.returnForm.value.price
        };

        this.store.dispatch([new GetFilter(depfilter, 'departure'), new GetFilter(refilter, 'return')]);
        this.modalCtrl.dismiss();
        
      }
      else if (this.flightType !== 'animated-round-trip'){
        let airline: airlineName[] = [];
        console.log(this.filterForm.value);
        for (const key in this.filterForm.value.airlines){
          airline.push({
            name: key,
            value: this.filterForm.value.airlines[key]
          });
        }
        let filter: flightFilter = {
          stops: this.filterForm.value.stops,
          depatureHours: this.filterForm.value.depHours,
          arrivalHours: this.filterForm.value.arrHours,
          corporateFare: this.filterForm.value.corpFare,
          airlines: airline,
          price: this.filterForm.value.price
        }

        console.log(filter);

        this.store.dispatch(new GetFilter(filter));
        this.modalCtrl.dismiss();
      }
    }
    
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
