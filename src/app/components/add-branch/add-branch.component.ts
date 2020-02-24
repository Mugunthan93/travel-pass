import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {

  @Output() closeBranch = new EventEmitter<boolean>();

  branchForm : FormGroup;

  constructor(
  ) { }

  ngOnInit() {
    this.branchForm = new FormGroup({
      name : new FormControl(),
      address : new FormControl(),
      gst_number : new FormControl(),
      mobile_number : new FormControl()
    });
  }

  addBranch(){
    this.closeBranch.emit(false);
  }

}
