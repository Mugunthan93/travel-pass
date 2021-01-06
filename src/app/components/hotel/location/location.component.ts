import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {

  options = {
    tourist: [
      { value: "East Coast Road(ECR)", selection: false },
      { value:"Kodambakkam", selection: false },
      { value:"Guindy", selection: false },
      { value: "Alwarpet", selection: false }
    ],
    bussiness_shopping: [
      { value: "Anna Salai", selection: false },
      { value: "T nagar", selection: false },
      { value: "Anna Nagar", selection: false }
    ],
    transit: [
      { value: "Internation Airport", selection: false },
      { value: "Egmore Station", selection: false },
      { value: "Central Station", selection: false }
    ],
    topareas: [
      { value: "Thousand Lights", selection: false },
      { value: "Triplicane", selection: false },
      { value: "Periyamet", selection: false }
    ]
  }

  constructor() { }

  ngOnInit() {}

  chipSelection(property: any,index : number) {
    console.log(property,index);
    property.selection = !property.selection;
  }

}
