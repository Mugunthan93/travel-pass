import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  rooms: any[] = ["1", "2", "3", "4", "5"];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.rooms = [
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" }
    ];
  }

  bookHotel() {
    this.router.navigate(['/', 'home', 'book', 'hotel']);
  }

}
