import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {

  @Output() closeBranch = new EventEmitter<boolean>();

  constructor(
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.closeBranch.emit(false);
  }

}
