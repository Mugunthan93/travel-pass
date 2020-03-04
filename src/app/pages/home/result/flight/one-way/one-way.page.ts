import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  @ViewChild('panel',{static : true}) panel : any;

  flightList : {
    type : string,accordian : string
  }[] = [
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
    {type:"listItem",accordian : "baggageItem"},
  ];
  panelOpenState = false;

  constructor(
  ) {
    console.log(this.panel);
  }
  
  ngOnInit() {
  }

}
