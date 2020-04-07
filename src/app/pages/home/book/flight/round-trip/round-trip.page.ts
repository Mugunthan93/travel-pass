import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  bookHeight: string = "45px";

  constructor() { }

  ngOnInit() {
  }

  FairValue(value: any) {
    console.log(value);
  }

}
