import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-meal-baggage',
  templateUrl: './meal-baggage.component.html',
  styleUrls: ['./meal-baggage.component.scss'],
})
export class MealBaggageComponent implements OnInit {

  type: string = null; 

  meals: any[] = ["1", "2", "3", "4", "5"];
  baggages: any[] = ["1", "2", "3", "4", "5"];

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
    this.type = "meal";
   }
  
  dismissMeal() {
    this.modalCtrl.dismiss(null,null,'passenger-meal');
  }

  change(type) {
    this.type = type.detail.value;
  }

}
