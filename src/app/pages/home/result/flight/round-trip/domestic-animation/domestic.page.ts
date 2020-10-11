import { Component, OnInit, ViewChild, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { Gesture, GestureDetail } from '@ionic/core';
import { AnimationController, Animation, GestureController, ModalController } from '@ionic/angular';
import { resultObj } from 'src/app/stores/result/flight.state';
import { Observable, Subscription, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { DomesticResultState, SelectedDepartureFlight, SelectedReturnFlight } from 'src/app/stores/result/flight/domestic.state';
import { GetFareQuoteSSR } from 'src/app/stores/book/flight/domestic.state';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit,OnDestroy {

  departList$: Observable<resultObj[]>;
  returnList$: Observable<resultObj[]>;

  selectedDepartureFlight$: Observable<resultObj>;
  selectedReturnFlight$: Observable<resultObj>;

  animationSub: Subscription;

  constructor(
    public animationCtrl: AnimationController,
    public gestureCtrl: GestureController,
    public modalCtrl : ModalController,
    private store : Store
  ) {

  }

  ngOnInit() {

    this.departList$ = this.store.select(DomesticResultState.getDomesticDepartureRoundTrip);
    this.returnList$ = this.store.select(DomesticResultState.getDomesticReturnRoundTrip);

    this.selectedDepartureFlight$ = this.store.select(DomesticResultState.getSelectedDepartureFlight);
    this.selectedReturnFlight$ = this.store.select(DomesticResultState.getSelectedReturnFlight);

    let animation: Observable<boolean> = concat(this.departList$, this.returnList$).pipe(map(el => true));
    this.animationSub = animation.subscribe((res: boolean) => res ? this.animation() : null);

  }

  ngOnDestroy(): void {
    this.animationSub.unsubscribe();
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
      onStart: (ev) => this.onStart(ev),
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

  currentDepartureFlight(flight : resultObj) {
    this.store.dispatch(new SelectedDepartureFlight(flight));
  }

  currentReturnFlight(flight: resultObj) {
    this.store.dispatch(new SelectedReturnFlight(flight));
  }

  book() {
    this.store.dispatch(new GetFareQuoteSSR());
  }

}
