import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-city',
  templateUrl: './multi-city.page.html',
  styleUrls: ['./multi-city.page.scss'],
})
export class MultiCityPage implements OnInit {

  oneWaySearch : FormGroup

  constructor() { }

  ngOnInit() {
    this.oneWaySearch = new FormGroup({});
  }

}
