import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
})
export class CalendarModalComponent implements OnInit {

  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  constructor() { }

  ngOnInit() {}

 
  onChange($event) {
    console.log($event);
  }

}
