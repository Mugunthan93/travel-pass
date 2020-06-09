import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { Animation, ModalController, AnimationController, GestureController, Gesture, GestureDetail } from '@ionic/angular';
import { Router } from '@angular/router';
import { flightResult } from 'src/app/models/search/flight';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightResultState, rountripValue } from 'src/app/stores/result/flight.state';
@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss']
})
export class RoundTripPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];

  flightState : boolean;
  listType: string = 'departure';
  
  selectedFlight : any = null;
  selectedDepartureFlight : any = null;
  selectedReturnFlight : any = null;
  
  departList: flightResult[];
  returnList: flightResult[];
  
  flightList: rountripValue;
  flightList$: Observable<rountripValue>;
  flightListSub: Subscription;

  constructor(
    public modalCtrl : ModalController,
    public router: Router,
    public animationCtrl: AnimationController,
    public gestureCtrl: GestureController,
    private store:Store
  ) {
  }
  
  ngOnInit() {
    this.flightList$ = this.store.select(FlightResultState.getRoundTrip);
    this.flightListSub = this.flightList$.subscribe(
      (res: rountripValue) => {
        console.log(res);
        this.departList = res.departure;
        this.returnList = res.return;
      }
    );
    this.animation();
  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        list: this.flightList,
        lisType: this.listType
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
    this.router.navigate(['/', 'home', 'book', 'flight', 'round-trip']);
  }

  currentFlight(flight) {

    if (this.listType == 'departure') {
      this.selectedDepartureFlight = flight;
    }
    else if (this.listType == 'return') {
      this.selectedReturnFlight = flight;
    }
  }

  //animation
  @ViewChild('content', { static: true, read: ElementRef }) contentEl: ElementRef;
  @ViewChild('departure', { static: true, read: ElementRef }) departureEl: ElementRef;
  @ViewChild('return', { static: true, read: ElementRef }) returnEl: ElementRef;
  departureColumns: QueryList<ElementRef>;
  returnColumns: QueryList<ElementRef>;

  departureGrow: Animation;
  returnShrink: Animation;

  departureShrink: Animation;
  returnGrow: Animation;

  depColumnGrow: Animation;
  depColumnShrink: Animation;

  reColumnGrow: Animation;
  reColumnShrink: Animation;

  swipeLeft: Animation;
  swipeRight: Animation;

  gesture: Gesture;

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
      .addAnimation([this.departureShrink, this.returnGrow]);
    

    this.gesture = this.gestureCtrl.create({
      el: this.contentEl.nativeElement,
      disableScroll: false,
      threshold: 10,
      gestureName: 'square-drag',
      onStart:(ev) => this.onStart(ev),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev)
    })

    this.gesture.enable(true);
  }

  onStart(ev: GestureDetail) {
    console.log(ev);
    if ((ev.deltaX > ev.deltaY) && ev.deltaX > 10) {
      this.swipeRight.play();
    }
    else if ((ev.deltaX < ev.deltaY) && ev.deltaX < -10) {
      this.swipeLeft.play();
    }
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

  departuredColumns(evt: QueryList<ElementRef>) {
    console.log(evt);
    this.departureColumns = evt;
    this.departureColumns.forEach(
      (column) => {
        this.depColumnGrow = this.animationCtrl.create()
          .addElement(column.nativeElement)
          .afterAddClass(['col-grow'])
          .afterRemoveClass(['col-shrink']);

        this.depColumnShrink = this.animationCtrl.create()
          .addElement(column.nativeElement)
          .afterAddClass(['col-shrink'])
          .afterRemoveClass(['col-grow']);

        this.swipeLeft.addAnimation([this.depColumnShrink]);
        this.swipeRight.addAnimation([this.depColumnGrow]);
      }
    );
    console.log(this.swipeLeft, this.swipeRight);
  }

  returnedColumns(evt: QueryList<ElementRef>) {
    console.log(evt);
    this.returnColumns = evt;
    this.returnColumns.forEach(
      (column) => {
        this.reColumnGrow = this.animationCtrl.create()
          .addElement(column.nativeElement)
          .afterAddClass(['col-grow'])
          .afterRemoveClass(['col-shrink']);

        this.reColumnShrink = this.animationCtrl.create()
          .addElement(column.nativeElement)
          .afterAddClass(['col-shrink'])
          .afterRemoveClass(['col-grow']);

        this.swipeLeft.addAnimation([this.reColumnGrow]);
        this.swipeRight.addAnimation([this.reColumnShrink]);
      }
    );
    console.log(this.swipeLeft, this.swipeRight);

  }

  ngOnDestroy() {
    if (this.flightListSub) {
      this.flightListSub.unsubscribe();
    }
  }
}
