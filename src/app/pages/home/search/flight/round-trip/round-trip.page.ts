import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  oneWaySearch : FormGroup


  constructor(
    public router : Router
  ) { }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({});
  }

  searchFlight() {
    this.router.navigate(['/','home','result','flight','round-trip']);
  }

}
