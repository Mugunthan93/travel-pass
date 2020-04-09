import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss'],
})
export class FlightListComponent implements OnInit {

  flightList: any[];


  constructor() { }

  ngOnInit() {
    this.flightList = ["1", "2", "3", "4"];
  }

}
