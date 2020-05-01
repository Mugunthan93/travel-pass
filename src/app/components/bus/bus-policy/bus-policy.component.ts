import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-policy',
  templateUrl: './bus-policy.component.html',
  styleUrls: ['./bus-policy.component.scss'],
})
export class BusPolicyComponent implements OnInit {

  constructor() { }

  policies: any[] = [
    { title: "More than 12hrs", percentage: "15", value: "171" },
    { title: "4 to 12 hrs", percentage: "30", value: "342" },
    { title: "3 to 4 hrs", percentage: "60", value: "684" },
    { title: "0 to 3 hrs", percentage: "90", value: "1026" }
  ];

  ngOnInit() {}

}
