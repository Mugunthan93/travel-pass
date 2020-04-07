import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  bookHeight: string = "45px";
  panels: any[] = [
    "trip 1",
    "trip 2",
    "trip 3",
    "trip 4",
    "trip 5",
    "trip 6"
  ];

  constructor() { }

  ngOnInit() {
  }

  FairValue(value: any) {
    console.log(value);
  }

}
