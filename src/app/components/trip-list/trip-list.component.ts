import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {

  items : string[] = ["trip1","trip2","trip3","trip4","trip1","trip2","trip3","trip4","trip1","trip2","trip3","trip4"];


  constructor() { }

  ngOnInit() {}

}
