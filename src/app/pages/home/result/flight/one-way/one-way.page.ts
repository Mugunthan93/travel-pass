import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Router } from '@angular/router';

export interface flightList{
  type : string,
  accordian : string,
  item? : {
    val : string
  }[],
  state:string
}

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];
  

  flightList: flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default'}
  ];

  panelOpenState = false;
  multipanel = true;

  selectedFlight: any = null;
  
  

  constructor(
    public modalCtrl : ModalController,
    public router : Router
  ) {
  }
  
  ngOnInit() {


    
  }

  sorting(evt){
    console.log(evt);
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        list: this.flightList
      }
    });

    modal.onDidDismiss().then(
      (filteredFlightList) => {
        this.flightList = filteredFlightList.data;
      }
    );

    return await modal.present();
  }

  book() {
    this.router.navigate(['/','home','book','flight','one-way']);
  }

  currentFlight(flight){
    this.selectedFlight = flight;
  }
}
