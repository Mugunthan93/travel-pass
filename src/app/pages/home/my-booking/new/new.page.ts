import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {


  list : any = [1,2,3,4,5,6,7,8];

  constructor() { }

  ngOnInit() {
  }

}
