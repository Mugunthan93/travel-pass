import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModule, CalendarComponent, CalendarComponentOptions, CalendarOptions, CalendarModalOptions } from 'ion2-calendar';
import { multicast } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarModalComponent implements OnInit, AfterViewInit {

  @Input() date;
  @Input() dateOptions: CalendarModalOptions;

  
  constructor(
    public modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

  close(date){
    this.modalCtrl.dismiss(date);
  }




}
