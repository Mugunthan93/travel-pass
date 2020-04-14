import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-about-hotel',
  templateUrl: './about-hotel.component.html',
  styleUrls: ['./about-hotel.component.scss'],
})
export class AboutHotelComponent implements OnInit {

  @Input() selectedSegement: string;

  constructor() { }

  ngOnInit() { }
  
  tabChange(evt : CustomEvent) {
    this.selectedSegement = evt.detail.value;
  }

}
