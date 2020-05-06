import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit() {
  }

  busPayment() {
    this.router.navigate(['/','home','book','bus','payment']);
  }

}
