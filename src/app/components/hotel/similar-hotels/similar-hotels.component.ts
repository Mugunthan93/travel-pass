import { Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-similar-hotels',
  templateUrl: './similar-hotels.component.html',
  styleUrls: ['./similar-hotels.component.scss'],
})
export class SimilarHotelsComponent implements OnInit {

  @ViewChild(IonContent, {static : true}) content: IonContent;
  images: string;
  scrollTop: number;
  scrollBottom: number;

  hotels: any[];

  constructor() {
   }

  ngOnInit() {
    console.log(this.content);
    
    this.hotels = [
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" },
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg"},
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg"},
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg"},
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg"},
      { name: 1, image: "../../../../assets/img/hotel/hotel-1.jpeg" }
    ];
  }

  scrolling(evt) {
    console.log(evt);
  }

}
