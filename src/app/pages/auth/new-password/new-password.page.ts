import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SetNewPassword } from 'src/app/stores/auth.state';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  passwordForm: FormGroup;

  constructor(
    private store : Store
  ) { }

  ngOnInit() {

    this.passwordForm = new FormGroup({
      new: new FormControl(null, [Validators.required]),
      confirm: new FormControl(null, [Validators.required])
    });

  }

  setPassword() {
    console.log(this.passwordForm.value);
    if (this.passwordForm.valid) {
      this.store.dispatch(new SetNewPassword(this.passwordForm.value));
    }
  }

}
