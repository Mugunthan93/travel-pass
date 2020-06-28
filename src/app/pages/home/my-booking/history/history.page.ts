import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  list: any = [1, 2, 3, 4, 5, 6, 7, 8];


  constructor() { }

  ngOnInit() {
  }

}
