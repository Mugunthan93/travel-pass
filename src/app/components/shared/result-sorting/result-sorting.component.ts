import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

  @Input() buttons: string[];

  constructor() { }

  ngOnInit() { }
  
  sorting(evt) {
    
  }

  rotate(item: any) {
    console.log(item);
    if (item.state == 'default') {
      item.state = 'rotated'
    }
    else if (item.state == 'rotated') {
      item.state = 'default'
    }
  }

}
