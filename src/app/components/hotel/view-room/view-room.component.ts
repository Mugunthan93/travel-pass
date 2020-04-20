import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss'],
})
export class ViewRoomComponent implements OnInit {

  rooms: any[] = ["1","2","3","4","5"];

  constructor() { }

  ngOnInit() {}

}
