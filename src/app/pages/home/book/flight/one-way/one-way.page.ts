import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {

  bookHeight: string = "45px";

  constructor() {
  }

  ngOnInit() {
  }

  FairValue(value : any) {
    console.log(value);
  }

}
