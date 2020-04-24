import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  seats: any[];
  recent_searches: any[];

  constructor() { }

  ngOnInit() {
    this.seats = [
      { seat: 1, value: "1", selection: true },
      { seat: 2, value: "2", selection: false },
      { seat: 3, value: "3", selection: false },
      { seat: 4, value: "4", selection: false },
      { seat: 5, value: "5", selection: false },
      { seat: 6, value: "6", selection: false }
    ];
    this.recent_searches = [1,2,3];
  }

  selectedSeat(seat) {
    this.seats.forEach(
      (seat) => {
        seat.selection = false;
      }
    );
    seat.selection = !seat.selection;
  }

}
