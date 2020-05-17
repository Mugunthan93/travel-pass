import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  cmpLogo: string = "../assets/logo.jpeg";

  constructor() {
  }

  async ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
