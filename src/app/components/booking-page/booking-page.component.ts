import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit {

  @Input() pageType : string;

  constructor() {

  }

  
  ngOnInit(): void {
  }


}
