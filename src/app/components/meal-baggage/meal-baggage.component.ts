import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-meal-baggage',
  templateUrl: './meal-baggage.component.html',
  styleUrls: ['./meal-baggage.component.scss'],
})
export class MealBaggageComponent implements OnInit {

  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { }
  
  dismissMeal() {
    this.modalCtrl.dismiss(null,null,'passenger-meal');
  }

}
