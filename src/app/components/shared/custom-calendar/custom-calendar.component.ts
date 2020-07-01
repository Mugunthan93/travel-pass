import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';
import * as moment from 'moment';

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
})
export class CustomCalendarComponent implements OnInit {

  date: string = moment().format('YYYY-MM-DD');
  type: string = 'moment';
  @Input() options: CalendarComponentOptions;
  
  constructor() { }

  ngOnInit() {}
  
  onChange(evt : CustomEvent) {
    console.log(evt);
  }

  onMonthChange(evt: CustomEvent) {
    console.log(evt);
  }

  onSelect(evt: CustomEvent) {
    console.log(evt);
  }

  onSelectStart(evt: CustomEvent) {
    console.log(evt);
  }

  onSselectEnd(evt: CustomEvent) {
    console.log(evt);
  }

}
