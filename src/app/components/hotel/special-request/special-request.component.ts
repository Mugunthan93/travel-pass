import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-special-request',
  templateUrl: './special-request.component.html',
  styleUrls: ['./special-request.component.scss'],
})
export class SpecialRequestComponent implements OnInit {

  request: any[];

  constructor() { }

  ngOnInit() {
    this.request = [
      "Non Smoking Room",
      "Late Check-in",
      "Early Check-in",
      "Room on a Higher Flow",
      "Large Bed",
      "Twin Beds",
      "Airport Transfer"
    ];
  }

}
