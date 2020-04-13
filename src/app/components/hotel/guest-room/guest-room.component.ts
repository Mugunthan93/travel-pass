import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guest-room',
  templateUrl: './guest-room.component.html',
  styleUrls: ['./guest-room.component.scss'],
})
export class GuestRoomComponent implements OnInit {

  rooms: any[] = ["1","3","5","7"];

  constructor() { }

  ngOnInit() { }
  
  addRoom() {
    this.rooms.push("6");
  }

}
