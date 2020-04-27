import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-bus-filter',
  templateUrl: './bus-filter.component.html',
  styleUrls: ['./bus-filter.component.scss'],
})
export class BusFilterComponent implements OnInit {

  Tabs: string;

  sort: any[];
  filter1: any[];
  filter2: any[];

  constructor(
    public alertCtrl : AlertController
  ) { }

  ngOnInit() {
    this.sort = [
      {
        name: "Rating",
        value: [
        { name:"highest" }
        ],
        selected: null
      },
      {
        name: "Price",
        value: [
        { name: "Cheapest" }
        ],
        selected: null
      },
      {
        name: "Duration",
        value: [
        { name:"Shortest" }
        ],
        selected: null
      },
      {
        name: "Departure",
        value: [
          { name: "Early" },
          { name: "late"}
        ],
        selected: null
      },
      {
        name: "Arrival",
        value: [
          { name: "Early" },
          { name: "late" }
        ],
        selected: null
      }
    ];
    this.filter1 = [
      {
        name: "Boarding Points",
        chips: [
          { name: "others",selection:false },
          { name: "koyambedu",selection:false }
        ]
      },
      {
        name: "Droping Points",
        chips: [
          { name: "others", selection: false  }
        ]
      },
      {
        name: "Travel Operators",
        chips: [
          { name: "others", selection: false  },
          { name: "Parveen Travels", selection: false  },
          { name: "SRS Travels", selection: false  }
        ]
      },
      {
        name: "Bus Type",
        chips: [
          { name: "Non AC Seater", selection: false  },
          { name: "Non AC Sleeper", selection: false  },
          { name: "AC Sleeper", selection: false  }
        ]
      }
    ]
    this.filter2 = [
      {
        name: "Pickup Time",
        duration: [
          { name: "afternoon", value: "11 AM to 6 AM" },
          { name: "evening",value: "6 PM to 11 PM" }
        ],
        type: 'time'
      },
      {
        name: "Drop Time",
        duration: [
          { name: "morning", value: "11 AM to 6 PM", icon: "" },
          { name: "night", value: "6 PM to 11 PM", icon: "" }
        ],
        type: 'time'
      },
    ];

    this.Tabs = "sortby";
  }

  selectTab(evt) {
    this.Tabs = evt.detail.value;
  }

  chipSelection(property: any) {
    console.log(property);
    property.selection = !property.selection;
  }

}
