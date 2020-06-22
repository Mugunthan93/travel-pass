import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { Gesture, GestureDetail } from '@ionic/core';
import { AnimationController, Animation, GestureController, ModalController } from '@ionic/angular';
import { roundtripResult, FlightResultState, resultObj } from 'src/app/stores/result/flight.state';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Store } from '@ngxs/store';
import { ResultState } from 'src/app/stores/result.state';
import { TripFilterComponent } from 'src/app/components/flight/trip-filter/trip-filter.component';
import { EmailItineraryComponent } from 'src/app/components/flight/email-itinerary/email-itinerary.component';

@Component({
  selector: 'app-domestic',
  templateUrl: './domestic.page.html',
  styleUrls: ['./domestic.page.scss'],
})
export class DomesticPage implements OnInit {

  sortButtons: any[] = [
    { value: 'departure', state: 'default' },
    { value: 'arrival', state: 'default' },
    { value: 'duration', state: 'default' },
    { value: 'price', state: 'default' }
  ];

  departList: resultObj[];
  departList$: Observable<resultObj[]>;
  
  returnList: resultObj[];
  returnList$: Observable<resultObj[]>;

  selectedFlight: any = null;
  selectedDepartureFlight: any = null;
  selectedReturnFlight: any = null;

  resultType: string;
  resultType$: Observable<string>;
  resultTypeSub: Subscription;

  mailStatus$: Observable<boolean>;

  constructor(
    public animationCtrl: AnimationController,
    public gestureCtrl: GestureController,
    public modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {

    this.resultType$ = this.store.select(ResultState.getResultType);
    this.resultTypeSub = this.resultType$.subscribe(
      (result: string) => {
        this.resultType = result;
        console.log(this.resultType);
      }
    );

    this.departList$ = this.store.select(FlightResultState.getDomesticDepartureRoundTrip);
    this.returnList$ = this.store.select(FlightResultState.getDomesticReturnRoundTrip);

    let animation$ = forkJoin({
      depature: this.departList$,
      return: this.returnList$
    })
    
    animation$.subscribe({
      next: (res: {
        depature: resultObj[],
        return: resultObj[]
      }) => {
        this.departList = res.depature;
        this.returnList = res.return;
      },
      complete: () => {
        this.animation();
      }
    });

  }

  async filter() {
    const modal = await this.modalCtrl.create({
      component: TripFilterComponent,
      componentProps: {
        type: this.resultType
      }
    });

    modal.onDidDismiss().then(
      (filteredData) => {
        console.log(filteredData);
        // this.flightList = filteredData.data;
      }
    );

    return await modal.present();
  }

  async mailTicket() {
    const modal = await this.modalCtrl.create({
      component: EmailItineraryComponent,
      componentProps: {
        type: this.resultType
      }
    });

    // modal.onDidDismiss().then(
    //   (filteredFlightList) => {
    //     this.flightList = filteredFlightList.data;
    //   }
    // );

    return modal.present();
  }

  changeStatus(status: Observable<boolean>) {
    this.mailStatus$ = status;
    this.mailStatus$.subscribe(status => console.log(status));
  }

  back() {

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

  currentFlight(evt) {
    
  }

  ngOnDestroy() {
  }

}
