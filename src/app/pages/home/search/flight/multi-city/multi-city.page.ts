import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  oneWaySearch : FormGroup

  constructor(
    public router : Router
  ) { }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({});
  }

  searchFlight() {
    this.router.navigate(['/','home','result','flight','multi-city']);
  }

}
