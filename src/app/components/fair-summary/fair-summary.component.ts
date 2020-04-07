import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface fare {
  name: string,
  amount: string
}

export interface summary {
  fares: fare[],
  title: string
}

@Component({
  selector: 'app-fair-summary',
  templateUrl: './fair-summary.component.html',
  styleUrls: ['./fair-summary.component.scss'],
})
export class FairSummaryComponent implements OnInit {

  @Output() fairValue: EventEmitter<any> = new EventEmitter();

  summaries: summary[] = [
    {
      fares: [
        { name: "Base Fare", amount: "2000" },
        { name: "Taxes", amount: "2000" },
        { name: "Markup", amount: null }

      ], title: "Fare Summary"
    },
    {
      fares: [
        { name: "Base Fare", amount: "2000" },
        { name: "Taxes", amount: "2000" },
        { name: "K3", amount: "2000" },
        { name: "Extra Meals", amount: "2000" },
        { name: "Extra Baggage", amount: "2000" },
        { name: "SGST", amount: "2000" },
        { name: "CGST", amount: "2000" },
        { name: "IGST", amount: "2000" }
      ], title: "Total Summary"
    }
  ];
  fairSummary: FormGroup;

  constructor() { }

  ngOnInit() {
    this.fairSummary = new FormGroup({
      markup: new FormControl(null),
      risk: new FormControl(null)
    });

    this.fairSummary.valueChanges.subscribe(
      (val) => {
        this.fairValue.emit(val);
      }
    );
  }

}
