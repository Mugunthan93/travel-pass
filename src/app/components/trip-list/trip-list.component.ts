import { Component, OnInit } from '@angular/core';

export interface tripList {
  from : string
  to : string
  date : string
  time : string
}

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {

  items : tripList[] = [
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    { from: 'CHE', to: 'CBE', date: '1994-11-05T08:15:30-05:00', time: '1994-11-05T08:15:30-05:00' },
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    {from : 'CHE', to : 'CBE', date: '1994-11-05T08:15:30-05:00', time:'1994-11-05T08:15:30-05:00'},
    { from: 'CHE', to: 'CBE', date: '1994-11-05T08:15:30-05:00', time: '1994-11-05T08:15:30-05:00' }
  ];


  constructor() {
   }

  ngOnInit() {}

}
