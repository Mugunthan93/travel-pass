import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngxs/store';
import { DurationSort, DepartureSort, ArrivalSort, PriceSort } from 'src/app/stores/result/flight.state';

@Component({
  selector: 'app-result-sorting',
  templateUrl: './result-sorting.component.html',
  styleUrls: ['./result-sorting.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('225ms ease-out')),
      transition('default => rotated', animate('225ms ease-in'))
    ])
  ]
})
export class ResultSortingComponent implements OnInit {

  @Input() buttons: any[];
  @Input() type: string;
  currentButton: any;

  constructor(
    private store : Store
  ) { }

  ngOnInit() { }
  
  sortChange(evt : CustomEvent) {
    this.currentButton = evt.detail.value;
    this.buttons.forEach(
      (el) => {
        if (el !== this.currentButton) {
          el.state = "default";
        }
      }
    );
    console.log(evt);
  }

  sorting(item: any) {
    if (item.value == 'departure') {
      this.store.dispatch(new DepartureSort(this.type, item.state));
    }
    else if (item.value == 'duration') {
      this.store.dispatch(new DurationSort(this.type, item.state));
    }
    else if (item.value == 'arrival') {
      this.store.dispatch(new ArrivalSort(this.type, item.state));
    }
    else if (item.value == 'price') {
      this.store.dispatch(new PriceSort(this.type, item.state));
    }

    if (item.state == 'default') {
      item.state = 'rotated'
    }
    else if (item.state == 'rotated') {
      item.state = 'default'
    }
  }

}
