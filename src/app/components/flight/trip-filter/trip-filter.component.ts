import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterState, filter, GetFilter, airlineName } from 'src/app/stores/result/filter.state';
import { StateReset } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.scss'],
})
export class TripFilterComponent implements OnInit {

  filterForm: FormGroup;
  airlines: FormGroup;

  inputs$: Observable<filter>;

  constructor(
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {

    this.inputs$ = this.store.select(FilterState.getFilter);
    this.airlines = this.fb.group({});

    this.inputs$.subscribe(
      (res: filter) => {
    
        this.filterForm = this.fb.group({
          "stops": this.fb.control(res.stops),
          "depHours": this.fb.control(res.depatureHours),
          "arrHours": this.fb.control(res.arrivalHours),
          "price": this.fb.control(res.price),
          "corpFare": this.fb.control(res.corporateFare),
          "airlines": this.airlines
        });
    
        console.log(this.filterForm);
        this.addAirlines(res);
      
    });


  }

  addAirlines(res: filter) {
    res.airlines.forEach((el) => {
      this.airlines.addControl(el.name,this.fb.control(el.value));
    });
  }
  
  close() {
    this.modalCtrl.dismiss();
  }

  chooseStop(evt: CustomEvent) {
    this.filterForm.controls['stops'].setValue(parseInt(evt.detail.value));
  }

  depRange(evt: CustomEvent) {
    this.filterForm.controls['depHours'].setValue(parseInt(evt.detail.value));
    console.log(evt);
  }

  reRange(evt: CustomEvent) {
    this.filterForm.controls['arrHours'].setValue(parseInt(evt.detail.value));
    console.log(evt);
  }

  priceRange(evt: CustomEvent) {
    this.filterForm.controls['price'].setValue(parseInt(evt.detail.value));
    console.log(evt);
  }

  corpFare(evt: CustomEvent) {
    this.filterForm.controls['corpFare'].setValue(parseInt(evt.detail.value));
  }

  reset() {
    this.store.dispatch(new StateReset(FilterState));
  }

  filter() {

    if (this.filterForm.valid) {
      
      let airline: airlineName[] = [];
  
      for (const key in this.filterForm.value.airlines){
        airline.push({
          name: key,
          value: this.filterForm.value.airlines[key]
        });
      }
  
      let filter: filter = {
        stops: this.filterForm.value.stops,
        depatureHours: this.filterForm.value.depHours,
        arrivalHours: this.filterForm.value.arrHours,
        corporateFare: this.filterForm.value.corpFare,
        airlines: airline,
        price: this.filterForm.value.price
      }
      this.store.dispatch(new GetFilter(filter));
      this.modalCtrl.dismiss();

    }

    
  }

}
