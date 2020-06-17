import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { filterInput, FlightResultState } from 'src/app/stores/result/flight.state';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.scss'],
})
export class TripFilterComponent implements OnInit {

  @Input() type: string;
  filterForm: FormGroup;
  airlines: FormGroup;

  inputs: filterInput = null;
  inputs$: Observable<filterInput>;
  inputsSub: Subscription;

  constructor(
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    private store : Store
  ) {
  }

  ngOnInit() {

    this.airlines = this.fb.group({});

    this.filterForm = this.fb.group({
      "stops": this.fb.control(null),
      "depHours": this.fb.control(0),
      "arrHours": this.fb.control(0),
      "price": this.fb.control(0),
      "corpFare": this.fb.control(false),
      "airlines": this.airlines
    });

    console.log(this.filterForm);


    this.inputs$ = this.store.select(FlightResultState.getFilter);
    this.inputsSub = this.inputs$.subscribe(
      (res: filterInput) => {
        this.addAirlines(res);
        this.inputs = res; 
        console.log(this.filterForm);
      }
    );

  }

  addAirlines(res: filterInput) {
    res.airlines.forEach((el) => {
      this.airlines.addControl(el,this.fb.control(false));
    });
  }
  
  close() {
    this.modalCtrl.dismiss();
  }

  reset() {
    
  }

  chooseStop(evt: CustomEvent) {
    console.log(evt);
    this.filterForm.controls['stops'].setValue(parseInt(evt.detail.value));
  }

  depRange(evt: CustomEvent) {
    console.log(evt);
  }

  reRange(evt: CustomEvent) {
    console.log(evt);
  }

  priceRange(evt: CustomEvent) {
    console.log(evt);
  }

  corpFare(evt : CustomEvent) {
    console.log(evt);
  }

  filter() {
    console.log(this.filterForm);
    
  }

}
