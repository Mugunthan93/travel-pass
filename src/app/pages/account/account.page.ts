import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit,OnDestroy {

  user : Account;
  userSub : Subscription;

  constructor(
    private authService :AuthService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.getUser.subscribe(
      (user) => {
        this.user = user;
        console.log(user);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
