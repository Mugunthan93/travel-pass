import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-drop-and-pickup',
  templateUrl: './select-drop-and-pickup.page.html',
  styleUrls: ['./select-drop-and-pickup.page.scss'],
})
export class SelectDropAndPickupPage implements OnInit {

  points: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectPoint: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  selectpoint() {
    this.selectPoint = true;
  }

  showDate(point, points) {
    console.log(point,points);
    return true;
  }

}
