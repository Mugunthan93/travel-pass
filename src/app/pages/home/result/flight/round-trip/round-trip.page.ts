import { Component, OnInit, Input } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/trip-filter/trip-filter.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { flightList } from '../one-way/one-way.page';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  flightList : flightList[];
  flightState : boolean;
  listType : string = 'departure';

  selectedFlight : any = null;
  selectedDepartureFlight : any = null;
  selectedReturnFlight : any = null;
  
  departList : flightList[] = [
    {type:"listItem1",accordian : "baggageItem1"},
    {type:"listItem2",accordian : "baggageItem2"},
    {type:"listItem3",accordian : "baggageItem3"},
    {type:"listItem4",accordian : "baggageItem4"},
    {type:"listItem5",accordian : "baggageItem5"},
    {type:"listItem6",accordian : "baggageItem6"}
  ];
  returnList : flightList[] = [
    {type:"listItem7",accordian : "baggageItem7"},
    {type:"listItem8",accordian : "baggageItem8"},
    {type:"listItem9",accordian : "baggageItem9"},
    {type:"listItem10",accordian : "baggageItem10"},
    {type:"listItem11",accordian : "baggageItem11"},
    {type:"listItem12",accordian : "baggageItem12"}
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
    this.router.navigate(['/','home','book','flight','one-way']);
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