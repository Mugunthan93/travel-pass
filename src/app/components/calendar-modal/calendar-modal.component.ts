import { Component, OnInit, AfterViewInit, LOCALE_ID, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarComponent } from 'ionic2-calendar/calendar';

export interface EventSource{
  title : string,
  startTime: Date,
  endTime: Date,
  allDay: boolean;
}

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarModalComponent implements OnInit, AfterViewInit {
  
  @ViewChild('myCalendar', {static : true}) myCalendar: CalendarComponent ;
  viewTitle : string;
  
  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() { 
    console.log(this.myCalendar);
    this.myCalendar.showEventDetail = false;
    this.myCalendar.formatDay = 'dd';
    this.myCalendar.formatDayHeader = 'E';
  }

  ngAfterViewInit() {
  }

  loadEvents() {
    this.myCalendar.eventSource.push({
      title: 'test',
      startTime: new Date,
      endTime: new Date,
      allDay: false
    });
    this.myCalendar.loadEvents();
  }

  slideNext() {
    this.myCalendar.slideNext();
  }

  slidePrev() {
    this.myCalendar.slidePrev();
  }

  onCurrentDateChanged(event: Date) {
    console.log('Currently viewed date: ' + event);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    if (this.myCalendar.calendarMode === 'month') {
      if (event.getFullYear() < today.getFullYear() || (event.getFullYear() === today.getFullYear() && event.getMonth() <= today.getMonth())) {
        this.myCalendar.lockSwipeToPrev = true;
      } else {
        this.myCalendar.lockSwipeToPrev = false;
      }
    }
  }

  reloadSource() {

  }

  onEventSelected(event) {
    console.log(event.title);
  }

  onViewTitleChanged(title : string) {
    this.viewTitle = title;
  }

  onTimeSelected(ev: { selectedTime: Date, events: any[] }) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
  }

  onRangeChanged(ev: { startTime: Date, endTime: Date }) {

  }

  close(date){
    this.modalCtrl.dismiss(date);
  }




}
