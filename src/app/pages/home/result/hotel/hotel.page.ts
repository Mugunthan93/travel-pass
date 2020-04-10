import { Component, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
  animations:[matExpansionAnimations.bodyExpansion]
})
export class HotelPage implements OnInit {

  hotelHeight: string;

  hotelList: any[] = ["1", "2", "3", "4", "5", "6","1", "2", "3", "4", "5", "6"];

  constructor() { }

  ngOnInit() {
    this.hotelHeight = "auto";
  }

  img(val) {
    console.log(val);
  }

}
