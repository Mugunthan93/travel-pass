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

  selectedFlight : any = {
    departure : null,
    return : null
  }
  
  departList : flightList[] = [
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"}
  ];
  returnList : flightList[] = [
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"}
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
    }
    else if(ListType.detail.value == 'return')
    {
      this.flightList = this.returnList;
      this.listType = ListType.detail.value;
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
      this.selectedFlight.departure = flight;
    }
    else if(this.listType == 'return'){
      this.selectedFlight.return = flight;
    }
  }
  
}
