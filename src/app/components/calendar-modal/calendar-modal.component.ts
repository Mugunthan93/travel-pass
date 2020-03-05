import { Component, OnInit, AfterViewInit, LOCALE_ID, ViewChild } from '@angular/core';
import { CalendarComponent } from "ionic2-calendar/calendar";

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
  ]
})
export class CalendarModalComponent implements OnInit, AfterViewInit {
  
  @ViewChild('myCalendar', {static : true}) myCalendar: CalendarComponent ;

  eventSource : EventSource[] = [];
  showEventDetail = true
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'en-GB',
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'testMDH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'testWDH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      }
    }
  }
  format = {
    day: 'dd',
    dayHeader: 'EEE',
    dayTitle: 'MMMM dd, yyyy',
    weekTitle: 'MMMM yyyy, "Week" w',
    monthTitle: 'MMMM yyyy',
    WeekViewDayHeader: 'EEE d',
    HourColumn: 'ha',
  }
  starting = {
    DayMonth: 0,
    DayWeek: 0
  }
  allDayLabel = 'all day';
  noEventsLabel = 'No Events';
  queryMode = 'local' || 'remote';
  timeInterval = 60;
  autoSelect = true;
  markDisabled = (date: Date) => {
    var current = new Date();
    return date < current;
  };
  scrollToHour = 0;
  preserveScrollPosition = false;
  lockSwipeToPrev = false;
  lockSwipes = false;
  startHour = 9;
  endHour = 20;
  sliderOptions = {};
  viewTitle = null;

  //template variable
  template = {
    month: {
      displayEvent: "monthviewDisplay",
      inactiveDisplayEvent: "monthviewInactiveDisplay",
      eventDetail: "monthviewEventDetail"
    },
    week: {
      header: "weekviewHeader",
      allday: {
        event: "weekviewAllDayEvent",
        eventsection: "weekviewAllDayEventSection"
      },
      normal: {
        event: "weekviewNormalEvent",
        eventsection: "weekviewNormalEventSection"
      },
      inactive: {
        allday: "weekviewInactiveAllDayEventSection",
        normal: "weekviewInactiveNormalEventSection"
      }
    },
    day: {
      allday: {
        event: "dayviewAllDayEvent",
        eventsection: "dayviewAllDayEventSection"
      },
      normal: {
        event: "dayviewNormalEvent",
        eventsection: "dayviewNormalEventSection"
      },
      inactive: {
        allday: "dayviewInactiveAllDayEventSection",
        normal: "dayviewInactiveNormalEventSection"
      }
    }
  }
  

  constructor(
  ) { }

  ngOnInit() { 
    console.log(this.myCalendar);
    this.myCalendar.showEventDetail = false;
    this.myCalendar.formatDay = 'dd';
    this.myCalendar.formatDayHeader = 'E';
  }

  ngAfterViewInit() {
    var me = this;
    setTimeout(function () {
      me.lockSwipes = true;
    }, 100);
  }

  loadEvents() {
    this.eventSource.push({
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

    if (this.calendar.mode === 'month') {
      if (event.getFullYear() < today.getFullYear() || (event.getFullYear() === today.getFullYear() && event.getMonth() <= today.getMonth())) {
        this.lockSwipeToPrev = true;
      } else {
        this.lockSwipeToPrev = false;
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
    // Events.query(ev, (events) => {
    //   this.eventSource = events;
    // });
  }



}
