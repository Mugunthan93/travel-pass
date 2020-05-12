import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    public platform: Platform,
    public router : Router
  ) {
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/','home','dashboard','home-tab']);
  }

}
