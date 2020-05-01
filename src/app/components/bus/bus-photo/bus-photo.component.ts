import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-photo',
  templateUrl: './bus-photo.component.html',
  styleUrls: ['./bus-photo.component.scss'],
})
export class BusPhotoComponent implements OnInit {

  photos: any[] = [
    "bus1",
    "bus2",
    "bus3",
    "bus4",
    "bus5",
    "bus6",
    "bus7"
  ];

  constructor() { }

  ngOnInit() {}

}
