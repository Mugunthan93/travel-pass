import { Component, OnInit } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { flightList } from '../one-way/one-way.page';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss']
})
export class RoundTripPage implements OnInit {

  flightList : flightList[];
  flightState : boolean;
  listType : string = 'departure';

  selectedFlight : any = null;
  selectedDepartureFlight : any = null;
  selectedReturnFlight : any = null;
  
  departList: flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] }
  ];
  returnList: flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }] }
  ];

  constructor(
    public modalCtrl : ModalController,
    public router : Router
  ) {
  }
  
  ngOnInit() {
    this.flightList = this.departList;
  }
  
  sorting(evt){
    console.log(evt);
  }

  changeListType(ListType){
    if(ListType.detail.value == 'departure')
    {
      this.flightList = this.departList;
      this.listType = ListType.detail.value;
      this.selectedFlight = this.selectedDepartureFlight;
    }
    else if(ListType.detail.value == 'return')
    {
      this.flightList = this.returnList;
      this.listType = ListType.detail.value;
      this.selectedFlight = this.selectedReturnFlight;
    }
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        list: this.flightList,
        lisType : this.listType
      }
    });

    modal.onDidDismiss().then(
      (filteredData) => {
        console.log(filteredData);
        this.flightList = filteredData.data;
      }
    );

    return await modal.present();
  }

  book() {
    this.router.navigate(['/','home','book','flight','round-trip']);
  }

  currentFlight(flight){
    
    if(this.listType == 'departure'){
      this.selectedDepartureFlight = flight;
    }
    else if(this.listType == 'return'){
      this.selectedReturnFlight = flight;
    }
  }
  
}
