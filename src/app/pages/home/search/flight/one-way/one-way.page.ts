import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  oneWaySearch : FormGroup

  constructor() {
   }

  ngOnInit(){
    this.oneWaySearch = new FormGroup({});
  }

}
