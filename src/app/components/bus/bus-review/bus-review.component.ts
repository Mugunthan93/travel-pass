import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-review',
  templateUrl: './bus-review.component.html',
  styleUrls: ['./bus-review.component.scss'],
})
export class BusReviewComponent implements OnInit {

  reviews : any[];

  constructor() { }

  ngOnInit() {
    this.reviews = [1,2,3,4,5];
   }

}
