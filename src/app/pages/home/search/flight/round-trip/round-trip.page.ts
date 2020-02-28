import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  oneWaySearch : FormGroup


  constructor() { }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({});
  }

}
