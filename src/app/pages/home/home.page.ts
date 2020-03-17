import { Component, OnInit } from '@angular/core';
import { ofActionDispatched, Actions } from '@ngxs/store';
import { LogOut } from 'src/app/stores/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public actions: Actions,
    public router : Router
  ) { }

  ngOnInit() {
    console.log("hello world");
    this.actions.pipe(ofActionDispatched(LogOut)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

}
