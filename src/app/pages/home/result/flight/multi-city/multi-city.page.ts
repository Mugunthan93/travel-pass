import { Component, OnInit } from '@angular/core';
import { flightList } from '../one-way/one-way.page';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];
  flightList : flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }, { val: "item2" }, { val: "item3" }], state: 'default' },
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    {type:"listItem",accordian : "baggageItem", item:[{ val:"item1"},{val:"item2"},{val:"item3"}], state:'default'},
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }, { val: "item2" }, { val: "item3" }], state: 'default' }
  ];
  selectedFlight : any = null;

  constructor(
    public modalCtrl : ModalController,
    public router : Router
  ) {
  }
  
  ngOnInit() {
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
    this.router.navigate(['/','home','book','flight','multi-city']);
  }

  currentFlight(flight){
    this.selectedFlight = flight;
  }

}
