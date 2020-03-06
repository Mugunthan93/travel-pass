import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-passenger-modal',
  templateUrl: './passenger-modal.component.html',
  styleUrls: ['./passenger-modal.component.scss']
})
export class PassengerModalComponent implements OnInit {

  traveller : FormGroup;

  constructor(
    public fb : FormBuilder
  ) {
  }

  ngOnInit() {
    this.traveller = this.fb.group({
      adult : this.fb.control(0),
      child : this.fb.control(0),
      infant : this.fb.control(0)
    });
  }

  confirmTraveller() {
    console.log(this.traveller.value);
  }

}
