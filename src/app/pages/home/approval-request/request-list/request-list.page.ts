import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {

  list: any = [1, 2, 3, 4, 5, 6, 7, 8];


  constructor() { }

  ngOnInit() {
  }

}
