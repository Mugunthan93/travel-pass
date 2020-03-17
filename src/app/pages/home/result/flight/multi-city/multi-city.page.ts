import { Component, OnInit } from '@angular/core';
import { flightList } from '../one-way/one-way.page';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TripFilterComponent } from 'src/app/components/trip-filter/trip-filter.component';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  flightList : flightList[] = [
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"}
  ];
  panelOpenState = false;
  multipanel = true;

  selectedFlight : any = null;

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
    this.router.navigate(['/','home','book','flight','multi-city']);
  }

  currentFlight(flight){
    this.selectedFlight = flight;
  }

}
