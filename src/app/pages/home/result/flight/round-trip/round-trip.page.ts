import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Animation, ModalController, AnimationController, GestureController, Gesture, GestureDetail } from '@ionic/angular';
import { Router } from '@angular/router';
import { flightList } from '../one-way/one-way.page';
@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss']
})
export class RoundTripPage implements OnInit {

  flightList : flightList[];
  flightState : boolean;
  listType: string = 'departure';

  selectedFlight : any = null;
  selectedDepartureFlight : any = null;
  selectedReturnFlight : any = null;
  
  departList: flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state:'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' }
  ];
  returnList: flightList[] = [
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' },
    { type: "listItem", accordian: "baggageItem", item: [{ val: "item1" }], state: 'default' }
  ];

  @ViewChild('content', { static: true, read: ElementRef }) contentEl: ElementRef;
  @ViewChild('departure', { static: true, read: ElementRef }) departureEl: ElementRef;
  @ViewChild('return', { static: true, read: ElementRef }) returnEl: ElementRef;

  departureGrow: Animation;
  returnShrink: Animation;

  departureShrink: Animation;
  returnGrow: Animation;

  swipeLeft: Animation;
  swipeRight: Animation;

  gesture: Gesture;
  

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    public animationCtrl: AnimationController,
    public gestureCtrl:GestureController
  ) {
  }
  
  ngOnInit() {
    this.flightList = this.departList;
    this.animation();
    console.log(this.departureEl);
  }

  animation() {
    this.departureGrow = this.animationCtrl.create()
      .addElement(this.departureEl.nativeElement)
      .afterAddClass(['depart-grow'])
      .afterRemoveClass(['depart-shrink']);

    this.returnShrink = this.animationCtrl.create()
      .addElement(this.returnEl.nativeElement)
      .afterAddClass(['return-shrink'])
      .afterRemoveClass(['return-grow']);

    this.swipeRight = this.animationCtrl.create()
      .duration(1000)
      .iterations(Infinity)
      .addAnimation([this.departureGrow, this.returnShrink]);

    this.departureShrink = this.animationCtrl.create()
      .addElement(this.departureEl.nativeElement)
      .afterAddClass(['depart-shrink'])
      .afterRemoveClass(['depart-grow']);

    this.returnGrow = this.animationCtrl.create()
      .addElement(this.returnEl.nativeElement)
      .afterAddClass(['return-grow'])
      .afterRemoveClass(['return-shrink']);

    this.swipeLeft = this.animationCtrl.create()
      .duration(1000)
      .iterations(Infinity)
      .addAnimation([this.departureShrink, this.returnGrow])

    this.gesture = this.gestureCtrl.create({
      el: this.contentEl.nativeElement,
      disableScroll: false,
      threshold: 10,
      gestureName: 'square-drag',
      direction: 'x',
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev)
    })

    this.gesture.enable(true);
  }

  onMove(ev: GestureDetail) {
    console.log(ev);
    if ((ev.deltaX > ev.deltaY) && ev.deltaX > 10) {
      this.swipeRight.play();
    }
    else if ((ev.deltaX < ev.deltaY) && ev.deltaX < -10) {
      this.swipeLeft.play();
    }
    
  }

  onEnd(ev: GestureDetail) {
    console.log(ev);
    if ((ev.deltaX > ev.deltaY) && ev.deltaX > 10) {
      this.swipeRight.stop();
    }
    else if ((ev.deltaX < ev.deltaY) && ev.deltaX < -10) {
      this.swipeLeft.stop();
    }
  }
  
  sorting(evt){
    console.log(evt);
  }

  changeListType(ListType){
    if(ListType.detail.value == 'departure')
    {
      this.flightList = this.departList;
      this.listType = ListType.detail.value;
      this.selectedFlight = this.selectedDepartureFlight;
    }
    else if(ListType.detail.value == 'return')
    {
      this.flightList = this.returnList;
      this.listType = ListType.detail.value;
      this.selectedFlight = this.selectedReturnFlight;
    }
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        list: this.flightList,
        lisType : this.listType
      }
    });

    modal.onDidDismiss().then(
      (filteredData) => {
        console.log(filteredData);
        this.flightList = filteredData.data;
      }
    );

    return await modal.present();
  }

  book() {
    this.router.navigate(['/','home','book','flight','round-trip']);
  }

  currentFlight(flight){
    
    if(this.listType == 'departure'){
      this.selectedDepartureFlight = flight;
    }
    else if(this.listType == 'return'){
      this.selectedReturnFlight = flight;
    }
  }
}
