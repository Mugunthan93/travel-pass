import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface carrier{
  
}

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit {

  flight : carrier;
  bus : carrier;
  hotel : carrier;
  cab : carrier;

  constructor(
    public router : Router
  ) { }

  ngOnInit() {
  }

  search(carrier : carrier) {
    this.router.navigate(['/','home','booking','search']);
  }

}
