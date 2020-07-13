import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/stores/auth.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  cmpLogo: string = "../assets/logo.jpeg";

  constructor(
  ) {
  }
  ngOnInit(): void {
  }

}
