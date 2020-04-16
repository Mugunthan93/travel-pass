import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-location',
  templateUrl: './hotel-location.component.html',
  styleUrls: ['./hotel-location.component.scss'],
})
export class HotelLocationComponent implements OnInit {

  landmarks: any[] = ["1","2","3","4","5"];

  constructor() { }

  ngOnInit() { }
  
  locationChange(evt) {
    console.log(evt);
  }

}
